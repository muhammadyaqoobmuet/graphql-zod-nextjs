# ProductivityPro

A modern fullstack productivity dashboard built with Next.js, GraphQL, Prisma, Apollo Client, and shadcn/ui.

## Features

- User authentication (register, login, JWT)
- Sleek dashboard with sidebar navigation
- Project and issue management (dummy cards)
- Responsive UI with shadcn/ui and Tailwind CSS
- GraphQL API with Prisma ORM

## Getting Started

1. **Install dependencies:**

   ```
   npm install
   ```

2. **Set up your environment:**

   - Copy `.env.example` to `.env` and fill in your database and JWT secrets.

3. **Run database migrations:**

   ```
   npx prisma migrate dev
   ```

4. **Start the development server:**

   ```
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Folder Structure

- `/app` - Next.js app routes and pages
- `/context` - React context for user authentication
- `/components` - UI components (sidebar, cards, etc.)
- `/api/graphql` - GraphQL schema, resolvers, and route
- `/prisma` - Prisma schema and migrations

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS & shadcn/ui
- Apollo Client & GraphQL
- Prisma ORM & SQLite/Postgres

---

**Note:** This is a basic starter. Customize and extend as needed!
