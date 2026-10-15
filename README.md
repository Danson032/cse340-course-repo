# CSE 340 Service Network

An Express, EJS, and PostgreSQL application for browsing community organizations, service projects, categories, and volunteer opportunities. The production entry point is the root `server.js`; it serves the W04 views and routes while using the root `src` database, authentication controller, and user model.

## Run locally

1. Install dependencies with `npm install`.
2. Create a local `.env` from `.env.example` and set:
   - `DATABASE_URL` to the PostgreSQL connection string.
   - `SESSION_SECRET` to a long, random value.
   - `NODE_ENV=development` and optionally `PORT=3000`.
3. Start the app with `npm start` or `npm run dev`.

The application requires `DATABASE_URL` and `SESSION_SECRET`. In production, the session cookie is HTTPS-only and the app trusts the hosting proxy.

## Database setup

For a fresh database, run `npm run db:auth-setup` first, followed by `npm run db:setup` to create the project tables and sample records. The base setup drops and recreates the organizations, projects, categories, and junction tables; do not run it against an existing database unless you intend to reset that data.

For an existing database, `npm run db:auth-setup` safely creates the `roles` and `users` tables if missing and adds the `user` and `admin` roles.

The W06 volunteer feature uses a `project_volunteers` many-to-many table. For an existing database, run `npm run db:volunteers-setup` to create that table without resetting project data.

Register a normal account through `/register`. To grant an account administrator access, run the following with the intended registered email:

```bash
node promote-admin.js user@example.com
```

## Render deployment

Keep the current Render web-service and PostgreSQL architecture. Set the web service's build command to `npm install` and start command to `npm start`. Set these environment variables in the Render dashboard (do not commit them):

- `DATABASE_URL`: the PostgreSQL connection string available to the service.
- `SESSION_SECRET`: a long, unique random secret.
- `NODE_ENV`: `production`.

For an existing database, run `npm run db:auth-setup` and `npm run db:volunteers-setup` against the intended database before deploying. Do not run the destructive `db:setup` command as part of deployment. The app listens on Render's `PORT`.

## Access rules

Organization, project, and category browsing is public. Dashboard access requires login. Registration and login are public; logout is available to authenticated users. Registered users can visit the dashboard, while only `admin` users can view `/users` or use organization, project, and category management routes.

Logged-in users can sign up for volunteer projects and remove their signups. Their selected projects appear on the dashboard.
