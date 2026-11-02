import type { AuthenticatedUser } from "../modules/auth/auth.service.ts";

declare global {
  namespace Express {
    interface Locals {
      user?: AuthenticatedUser;
    }
  }
}

export {};
