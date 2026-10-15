# CSE 340 Service Network

An Express, EJS, and PostgreSQL application for browsing community organizations,
service projects, and categories. The production entry point is the root
`server.js`; it serves the W04 views and routes while using the root `src`
database, authentication controller, and user model.

## Run locally

1. Install dependencies with `npm install`.
2. Create a local `.env` from `.env.example` and set:
   - `DATABASE_URL` to the PostgreSQL connection string.
   - `SESSION_SECRET` to a long, random value.
   - `NODE_ENV=development` and optionally `PORT=3000`.
3. Start the app with `npm start` or `npm run dev`.

The application requires `DATABASE_URL` and `SESSION_SECRET`. In production,
the session cookie is HTTPS-only and the app trusts the hosting proxy.

## Database setup

The existing application database must already contain the organizations,
projects, and category tables. `npm run db:auth-setup` runs the additive
`src/auth-schema.sql` script, which creates `roles` and `users` if missing and
adds the `user` and `admin` roles without resetting existing data.

Register a normal account through `/register`. To grant an account administrator
access, run the following with the intended registered email:

```bash
node promote-admin.js user@example.com
```

Do not run `npm run db:setup` against an existing database unless you intend to
recreate the application tables and sample records: `src/setup.sql` drops and
recreates the organizations, projects, categories, and junction tables.

## Render deployment

Keep the current Render web-service and PostgreSQL architecture. Set the web
service's build command to `npm install` and start command to `npm start`. Set
these environment variables in the Render dashboard (do not commit them):

- `DATABASE_URL`: the PostgreSQL connection string available to the service.
- `SESSION_SECRET`: a long, unique random secret.
- `NODE_ENV`: `production`.

Set up the authentication schema against the intended database once using
`npm run db:auth-setup` with its `DATABASE_URL`; do not run the destructive
`db:setup` command as part of deployment. The app listens on Render's `PORT`.

## Access rules

Organization, project, and category browsing is public. Dashboard access
requires login. Registration, login, and logout are available to visitors and
users; registered users can visit the dashboard, while only `admin` users can
view `/users` or use organization, project, and category management routes.
