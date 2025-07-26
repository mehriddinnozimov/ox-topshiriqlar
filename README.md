# Ox API

A backend API for managing companies, users, and products, built with NestJS and Prisma.

---

## Environment Variables

Create a `.env` file in the project root. Example:

```
# Application
APP_PORT=3000
NODE_ENV=development

# JWT secrets
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Cookie secret
COOKIE_SECRET=your_cookie_secret

# Debugging
DEBUG=true

# PostgreSQL (for Docker Compose or local)
POSTGRES_USER=oxuser
POSTGRES_DB=oxdb
POSTGRES_HOST=postgres
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=passwor343d

# Prisma database URL
DATABASE_URL=postgresql://oxuser:password@localhost:15432/oxdb

# Ox domain
OX_DOMAIN=ox-sys.com
```

---

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up the database:**
   ```bash
   pnpm run db:push
   ```

3. **Start the development server:**
   ```bash
   pnpm run start:dev
   ```

4. **Swagger API docs:**  
   The Swagger URL is shown in the console when the application starts.

---

## Notes

- Make sure to update secrets and passwords for production use.
- For Docker Compose, use the provided PostgreSQL environment variables.

---