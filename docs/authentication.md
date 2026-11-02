
# Authentication API Documentation

## Helpdesk Ticket Management System

### Authentication Architecture

- Session-based authentication
- bcryptjs password hashing
- PostgreSQL session storage
- SHA-256 hashed session tokens
- HttpOnly session cookies
- Express authentication middleware

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Authenticate a user |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/logout | Revoke current session |

## Registration

Request:

{
  "name": "Demo Customer",
  "email": "demo@example.com",
  "password": "StrongPassword#2026"
}

Success: 201 Created

New public registrations receive CUSTOMER role.

## Login

Request:

{
  "email": "demo@example.com",
  "password": "StrongPassword#2026"
}

Success: 200 OK

A session cookie is issued after successful authentication.

## Current User

GET /api/auth/me

Requires a valid session cookie.

Success: 200 OK

Unauthenticated: 401 Unauthorized

## Logout

POST /api/auth/logout

Revokes the current session and clears the cookie.

## Security

- Passwords are hashed using bcrypt.
- Password hashes are never returned by the API.
- Raw session tokens are not stored in the database.
- Session expiration is seven days.
- Cookies are HttpOnly and SameSite=Lax.
- Authentication endpoints have rate limiting.
- Public registration cannot assign privileged roles.
