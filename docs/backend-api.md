# Backend API Documentation

## Helpdesk Ticket Management System

### Technology Stack
- Node.js
- Express.js 5
- TypeScript
- PostgreSQL
- Prisma ORM 7

## Local Development

Start PostgreSQL:

    docker compose up -d db

Start Backend:

    cd server
    npm install
    npx prisma generate
    npm run dev

## API Endpoints

### Health Check

GET /api/health

Successful Response:

    HTTP 200 OK

    {
      "success": true,
      "data": {
        "service": "helpdesk-ticket-management-system",
        "status": "ok",
        "database": "connected"
      }
    }

The response also includes uptime and timestamp.

## Development Commands

- npm run dev
- npm run typecheck
- npm run build
- npm start

## Planned API Modules

- Authentication
- User Management
- Ticket Management
- Team Management
- Comments
- Attachments
- SLA Management
- Dashboard & Reports
