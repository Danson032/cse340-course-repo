# cse340-course-repo

hello I am testing if everyting is working well


## W06 volunteer feature

The volunteer feature uses the `project_volunteers` many-to-many table. For a fresh database, create the authentication tables first with `npm run db:auth-setup`, then run `npm run db:setup` to build the project schema and sample data.

For an existing database, do **not** run `npm run db:setup` because it drops and recreates the project tables. Instead, run `npm run db:volunteers-setup` with `DATABASE_URL` set to the database you intend to migrate. This migration only creates the volunteer table if it does not already exist.
