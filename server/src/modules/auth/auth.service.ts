
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";

import { prisma } from "../../lib/prisma.ts";
import { ApiError } from "../../common/errors/ApiError.ts";

import type {
  RegisterInput,
  LoginInput,
} from "./auth.validation.ts";

const SESSION_DURATION_DAYS = 7;
const BCRYPT_ROUNDS = 12;

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

function hashToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

async function createSession(user: AuthenticatedUser) {
  // Generate a secure random token
  const token = randomBytes(32).toString("hex");

  // Store only its SHA-256 hash in the database
  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() +
      SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.session.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
    user,
  };
}

// ===============================
// REGISTER
// ===============================

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "Email is already registered",
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    BCRYPT_ROUNDS
  );

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,

        // Never accept role from public registration.
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return await createSession(user);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ApiError(
        409,
        "Email is already registered",
        "EMAIL_ALREADY_EXISTS"
      );
    }

    throw error;
  }
}

// ===============================
// LOGIN
// ===============================

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user || !user.isActive) {
    throw new ApiError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  const publicUser: AuthenticatedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return createSession(publicUser);
}

// ===============================
// GET USER FROM SESSION
// ===============================

export async function getUserFromSession(
  token: string
): Promise<AuthenticatedUser | null> {
  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          isActive: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (
    session.expiresAt <= new Date() ||
    !session.user.isActive
  ) {
    await prisma.session.deleteMany({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    createdAt: session.user.createdAt,
  };
}

// ===============================
// LOGOUT
// ===============================

export async function logoutUser(token: string) {
  const tokenHash = hashToken(token);

  await prisma.session.deleteMany({
    where: {
      tokenHash,
    },
  });
}
