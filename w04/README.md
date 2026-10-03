# CSE 340 Service Network - W04

This version includes the W04 Create/Update functionality for categories and the required CRUD functionality for organizations and service projects.

## Run locally

1. Make sure PostgreSQL is available and your `.env` contains a valid `DATABASE_URL`.
2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm run dev
```

or:

```bash
npm start
```

Do not run `npm run db:setup` against an existing assignment database unless you intentionally want to recreate the database and its sample data.

## W04 routes

### Categories
- `GET /categories`
- `GET /category/:id`
- `GET /new-category`
- `POST /new-category`
- `GET /edit-category/:id`
- `POST /edit-category/:id`

### Organizations
- `GET /organizations`
- `GET /organization/:id`
- `GET /new-organization`
- `POST /new-organization`
- `GET /edit-organization/:id`
- `POST /edit-organization/:id`

### Service Projects
- `GET /projects`
- `GET /project/:id`
- `GET /new-project`
- `POST /new-project`
- `GET /edit-project/:id`
- `POST /edit-project/:id`

## Category validation

Client-side validation:
- required
- maximum 100 characters

Server-side validation:
- required
- minimum 3 characters
- maximum 100 characters

The minimum length is intentionally not included in the HTML validation so the server-side rule can be tested.
