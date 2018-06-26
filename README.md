# opla-backend

[![Build
Status](https://travis-ci.org/Opla/backend.svg?branch=master)](https://travis-ci.org/Opla/backend)

Opla.ai Backend using Node es7 react and redux.


## Getting started

### Prerequisites

First of all, make sure you have [Node 8.x](https://nodejs.org/en/download/) and
[Yarn](https://yarnpkg.com/en/docs/install) installed.

You will also need [MariaDB 10.2](https://mariadb.org/) or [mysql 5.7](https://www.mysql.com/). We provide a [Docker
Compose](https://docs.docker.com/compose/) configuration to get you started
quickly.

### Installation

1. Install the (dev) dependencies:

    ```
    $ yarn install
    ```

2. Run the configuration tool:

   ```
   $ bin/opla init
   ```

   **Important:** if you want to use Docker Compose, accept all the default
   settings and run `docker-compose up -d`, otherwise configure your MariaDB
   instance.

3. Run the migrations:

   ```
   $ bin/opla migrations up
   ```

4. Start the dev environment:

    ```
    $ yarn dev
    ```

This application should be available at: http://127.0.0.1:8081/.


## Database migrations

We use [db-migrate](http://db-migrate.readthedocs.io/en/latest/) to manage the
database migrations with a specific configuration for this project. By using the
`bin/opla` tool, this configuration is automatically generated and `db-migrate`
is bound to the `bin/opla migrations` command. Do not run `db-migrate` directly
(it should complain about not finding the configuration file anyway).

### Creating a migration

1. Run:

   ```
   $ bin/opla migrations create "short explanation of the migration"
   ```

   The `"short explanation of the migration"` will be used in the migration
   filename (see the content of the [`migrations/`](migrations/) folder for some
   examples). Choose something short and self-explanatory.

   This command will create several files, all of them should be put into Git.
   You should not have to care about the generated JavaScript files as writing
   migrations in plain SQL is much easier. In addition, you should not deal with
   the `down` migrations, since database rollbacks never work in practice, we
   only go forward.

2. Write your migration in plain SQL in the generated file:


   ```
   echo "<SQL STATEMENT>;" > migrations/sqls/20180307110023-short-explanation-of-the-migration-up.sql
   ```

   Then, you can apply this migration and make sure everything works as
   intended.

### Applying migrations

To apply all migrations at once, run:

   ```
   $ bin/opla migrations up
   ```

## Docker image
The CI/CD pipeline produces a Docker image that you can use to run the Backend.

### Environment variables

| env                        | default  | description                                                                                                                         |
|----------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------|
| SKIP_MIGRATIONS            | false    | Skips the database migration step. Useful for production use, where database schema is most likely already set.                     |
| MIGRATIONS_ONLY            | true     | Only does the migration step. Useful for production use, to use the backend container to initialise the db for the very first time. |
| OPLA_BACKEND_DATABASE_HOST | db       | Database host                                                                                                                       |
| OPLA_BACKEND_DATABASE_NAME | opla_dev | Database name                                                                                                                       |
| OPLA_BACKEND_DATABASE_USER | opla     | Database user                                                                                                                       |
| OPLA_BACKEND_DATABASE_PASS | foo      | Database password                                                                                                                   |

## Contributing

Please, see the [CONTRIBUTING](CONTRIBUTING.md) file.


## Contributor Code of Conduct

Please note that this project is released with a [Contributor Code of
Conduct](http://contributor-covenant.org/). By participating in this project you
agree to abide by its terms. See [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) file.

## Docker Image

### Configuration
You have 2 options: 
    - pass ENV variables to override config properties one by one. See Dockerfile `ENV` statement for available environment variables.
    - override `default.json` by mounting your own `/src/config/config.json` file. You can create such a file by running `bin/opla init` locally.

## License

opla-front is released under the GPL v2.0+ License. See the bundled
[LICENSE](LICENSE) file for details.
