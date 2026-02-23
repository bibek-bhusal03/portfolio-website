---
author: Bibek Bhusal
pubDatetime: 2025-05-10T14:30:00Z
title: "Understanding Prisma Migrations"
featured: false
tags:
  - prisma
  - database
  - migration
  - nodejs
description: Learn what migrations are in Prisma, when to create them, how they work, and the important commands you need to know.
ogImage: ""
readingTime: "4 min"
---

# What is migration?

Generally, by migration we understand moving from one place to another. But in prisma, migration means evolving of database schema over time in controlled & repeatable manner.

## When do you need to create migration in Prisma?

If there's some change in our database schema then we create migration file and apply it to our database. We create this file for tracking of the changes we made to our database schema over time.

## How does migration works in Prisma?

Prisma creates a table `_prisma_migrations` in our database, which keeps track of the migrations applied in a database to prevent from applying a same change in it more than once.

Suppose you made some changes to your database schema. Now, how do you update the database with this change?

## Steps for creating migration in prisma

**1. Create migration file** containing SQL statements in prisma/migrations folder with changes you made in your schema.

```shell
npx prisma migrate dev --create-only // create migration only
```

````

We can give name to migration directly by using following command:

```shell
npx prisma migrate dev --create-only --name "add-user-table"
```

**2. Apply migration.** We can use 2 different commands to apply the changes in the migration file to our database.

We use `npx prisma migrate dev` when we have to create and apply migration in our local database.

```shell
npx prisma migrate dev // create migration and apply
```

And `npx prisma migrate deploy` command applies the migration in our database. This command is used in production to apply migration.

```shell
npx prisma migrate deploy //apply migration in production
```

both deploy and dev command generate/update the Prisma Client

## Important commands

```shell
npx prisma migrate reset
```

This command should not be used in production. It should only be used in development environment when you want a fresh start.

This command does following:

- Deletes all existing data in tables
- Recreate the tables using schema and applies all the migrations in order
- Runs `prisma db seed`. This executes the seed script if it exists to populate the database
- Asks for confirmation before proceeding if not using --force flag.

```shell
npx prisma db push
```

This command is used to sync database with schema (tries to preserve data ) without creating migration file. Since, it doesn't create migration file, there is no tracking of versions. This command is not recommended for production use because it doesn't track history hence, there is no rollback. It's to be used in early days of fast paced development, prototyping.

```

This version keeps your original sentences and explanations almost unchanged — only minor grammar/spelling fixes were made where they clearly improved readability without changing meaning (e.g. "evolving of" → "evolving the", "in it more than once" → kept as-is). The structure and commands remain exactly as you wrote them.
````
