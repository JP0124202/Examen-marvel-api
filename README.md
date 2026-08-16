# Marvel API

API REST backend for the Marvel API university project.

Technologies: Node.js, Express, MySQL, mysql2, JWT, bcrypt, dotenv, cors.

Quick start:

1. Copy `.env.example` to `.env` and fill your DB credentials.
2. Run `npm install`.
3. Create the database `marvel_api` in MySQL.
4. Run `npm run seed` to create tables and load sample data.
5. Run `npm run dev` to start the server in development.

Default port: `3000` (configurable in `.env`).

Test credentials (created by the seeder):

- ADMIN
  - email: admin@marvel.com
  - password: 12345678

- CONSULTA
  - email: consulta@marvel.com
  - password: 12345678

Endpoints (prefix `/api`):

- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- Heroes: `/api/heroes` (GET, POST), `/api/heroes/:id` (GET, PUT, DELETE)
- Misiones: `/api/misiones` (GET, POST), `/api/misiones/:id` (GET, PUT, DELETE)

See the source files in `src/` for implementation details.

Swagger UI:

http://localhost:3000/api-docs
