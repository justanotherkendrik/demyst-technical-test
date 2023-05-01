# Backend

The backend is implemented using Go mostly because I have not used Go in a professional capacity before and really wanted to challenge myself and see how I can refine my usage of Go.

## Table of Contents:

- [Implementation Details](#implementation-details)
- [App Contents](#app-contents)
  - [domains](#domains)
  - [migrations](#migrations)
  - [scripts](#scripts)
  - [shared](#shared)
- [How-tos](##how-tos)
  - [Creating a new domain](#creating-a-new-domain)
  - [Creating a new migration](#creating-a-new-database-migration)
  - [Applying a database migration](#applying-a-database-migration)
  - [Running an integration test](#running-an-integration-test)
  - [Run the app locally](#run-the-app-locally)
  - [Deploying the containerized app](#deploying-the-containerized-app)
  - [Stopping the containerized app](#stopping-the-containerized-app)

## Implementation Details

[Gin Gonic](https://gin-gonic.com/) was used to implement the API.

A Postgres database is used to store data of the entities required in this app, with a Redis cache implemented to facilitate the applying of rules during applying for the loan. I understand that they did not seem to be needed for the flowchart, but I guess I got really curious and wanted to fiddle around to see what I could learn from there.

The standard `gotest` library is used for integration testing. In this case, I deferred from implementing unit tests as the flow of the app seemed to be rather direct, and I felt that implementing unit tests and mocking inputs and outputs for a significantly read-heavy app might not necessarily account for ensuring that the database connection was set up correctly and can be used to retrieve the necessary information. A command existing in `./scripts/integration_test.sh` helps to minimise the overhead and complexity for a developer who wishes to run all these tests immediately.

In the app, there are `[development, example and test].env` files:

- `development.env` is used for typical development work and is the default fallback.
- `example.env` is a reference for the environment variables used in the app.
- `test.env` is used for integration tests.

## App Contents

The backend folder has the following directories:

- [`domains`](##domains) - This is where the business models are situated in.
- [`migrations`](##migrations) - This folder contains all database migrations to be used as sample/ test data.
- [`scripts`](##scripts) - This folder contains a few helper scripts to make running the app a little easier.
- [`shared`](##shared) - This folder contains some services and utilities that ensure the app runs smoothly.

## `domains`:

There are four domains here, with the `businesses` domain having a `balances` subdomain. For each singular entity identified as a domain or subdomain, they have the following schemas:

- `accounting_providers`:

  ```
  type AccountingProvider struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
  }
  ```

- `businesses`:

  ```
  type Business struct {
    ID              int     `json:"id"`
    Name            string  `json:"name"`
    YearEstablished int     `json:"year_established"`
    AssetValue      float64 `json:"asset_value"`
  }
  ```

- `balances`:

  ```
    type BalanceSummary struct {
      AverageAssetValue float64 `redis:"average_asset_value"`
      OverallProfit     float64 `redis:"overall_profit"`
      Profitable        bool    `redis:"is_profitable"`
    }
  ```

- `loans`, which has the following request schema:

  ```
  type CreateLoanSchema struct {
    Business           int     `json:"business" binding:"required"`
    AccountingProvider int     `json:"accounting_provider" binding:"required"`
    Applicant          int     `json:"applicant" binding:"required"`
    Amount             float64 `json:"amount" binding:"required,gt=0"`
  }
  ```

- `users`:

  ```
  type User struct {
    ID          int    `json:"id"`
    Email       string `json:"email"`
    DisplayName string `json:"display_name"`
  }
  ```

Each domain (and subdomain) should have the following subdirectories wherever applicable:

- `queries`: Contains all application logic that queries the database.
- `routes`: Contains the logic behind the API routes.
- `schemas`: Contains schemas pertaining to the domain that can be used either in the database or within the application logic itself.
- `subdomains`: Contains domains that fall under a specific parent domain, with the relationship between `businesses` and `balances` being an example.
- `validators`: Contains validation functions that are used to avoid repetitions in checking logic (refer to `loans/validators/validate_entity_existence.go` and its usage).
- `main_test.go`: Contains various test scenarios that are accounted for within the backend. They will require the use of `./scripts/integration_test.sh` to run.
- `main.go`: Contains the router group in use for the domain itself.

In development, the `API_URL` that is typically used here is `http://localhost:8080`. The endpoints typically have the following anatomy:

```
{api_url}/{domain_name}/{domain_entity_id}/{subdomain_name}?[query_params]
```

**Note that `{domain_entity_id}`, `{subdomain_name}` and `[query_params]` are optional.**

For all endpoints implemented, the response `Content-Type` is `application/json`. The following endpoints exist for the aforementioned `domains`:

### `accounting_providers`

- `/accounting_providers` - Retrieve all accounting providers.

  - Available methods: `GET`
  - Request details:
    - Query Parameters: None
    - Path Parameters: None
    - Body: None
  - Response Details:
    - Body:
      - `providers` - an array containing `AccountingProvider` objects.
    - Possible Status Codes:
      - `200` - `http.StatusOK`
      - `500` - `http.StatusInternalServerError`
  - Example:
    - Usage:
      ```
      curl http://localhost:8080/accounting_providers
      ```
    - Result:
      ```
      {
        "providers": [
          {
            "id": 1,
            "name": "Xero"
          },
          {
            "id": 2,
            "name": "MYOB"
          }
        ]
      }
      ```

### `businesses`

- `/businesses` - Retrieve all businesses.

  - Available methods: `GET`
  - Request details:
    - Query Parameters: None
    - Path Parameters: None
    - Body: None
  - Response Details:
    - Body:
      - `businesses` - an array containing `Business` objects
    - Possible Status Codes:
      - `200` - successful
      - `500` - internal server error
  - Example:
    - Usage:
      ```
      curl http://localhost:8080/businesses
      ```
    - Result:
      ```
      {
        "businesses": [
          {
            "id": 1,
            "name": "Business 1",
            "year_established": 2021,
            "asset_value": 100000
          },
          {
            "id": 2,
            "name": "Business 2",
            "year_established": 2022,
            "asset_value": -100000
          },
          {
            "id": 3,
            "name": "Business 3",
            "year_established": 2021,
            "asset_value": 2000
          }
        ]
      }
      ```

- `/businesses/{id}/balances` - Retrieve the balance sheet of a business that can be identified with `{id}`. The endpoint will only retrieve entries up to 12 months prior to the current date and time in descending order.
  - Available methods: `GET`
  - Request details:
    - Query Parameters: None
    - Path Parameters:
      - `id` - The `id` of the business to retrieve the balance sheet
    - Body: None
  - Response Details:
    - Body:
      - `balance_sheet` - an array containing `BalanceSummary` objects
      - `business` - the `Business` object retrieved that corresponds to the provided `id`
    - Possible Status Codes:
      - `200` - successful
      - `400` - invalid `id` provided for business
      - `404` - `id` for the business does not exist
      - `500` - internal server error
  - Example:
    - Usage:
      ```
      curl http://localhost:8080/businesses/1/balances
      ```
    - Result:
      ```
      {
        "balance_sheet": [
          {
            "profit_or_loss": -23830,
            "assets_value": -393633,
            "timestamp": "2023-03-20 22:03:05"
          },
          {
            "profit_or_loss": -42188,
            "assets_value": -102692,
            "timestamp": "2023-01-28 11:22:37"
          },
          {
            "profit_or_loss": -7381,
            "assets_value": 314769,
            "timestamp": "2022-10-30 07:42:56"
          },
          {
            "profit_or_loss": 15664,
            "assets_value": -610957,
            "timestamp": "2022-09-05 16:42:04"
          },
          {
            "profit_or_loss": -54717,
            "assets_value": -82143,
            "timestamp": "2022-06-11 19:24:47"
          }],
        "business": {
            "id": 1,
            "name": "Business 1",
            "year_established": 2021,
            "asset_value": 100000
          }
      }
      ```

### `loans`

- `/loans` - Submits a loan application.

  - Available methods: `POST`
  - Content-Type: `application/json`
  - Request Details:
    - Headers:
      - `Content-Type`: `application/json`
    - Body:
      - `applicant` - `id` of the `User` submitting the loan application **(required)**.
      - `business` - `id` of the `Business` selected by the user **(required)**
      - `accounting_provider` - `id` of the `AccountingProvider` selected by the user **(required)**
      - `amount` - the desired amount of money to loan **(required)**
  - Response Details:
    - Body:
      - `loan_amount` - the final amount loaned to the user
      - `assessment_value` - the final assessment value determined by the decision engine that is used against the requested `amount` to determine the final `loan_amount`
      - `result` - a boolean flag denoting the outcome of the loan application. A successful loan is denoted with `result: true`
    - Possible Status Codes:
      - `201` - successful
      - `400` - provided request body was invalid
      - `404` - `id` for either the `applicant`, `business` or `accounting_provider` does not exist
      - `500` - internal server error
  - Example:
    - Usage:
      ```
      curl -X POST -H 'Content-Type: application/json' -d '{"applicant":1,"business":1,"accounting_provider":1,"amount":500}' http://localhost:8080/loans
      ```
    - Result:
      ```
      {
        "loan_amount": 100,
        "assessment_value": 20,
        "result": true
      }
      ```

### `users`

- `/users` - Retrieves details of a user in the form of a `User` object.

  - Available methods: `GET`
  - Request Details:
    - Query Parameters:
      - `email`: Email assigned to the user account.
  - Response Details:
    - Body:
      - `id` - `id` of the user.
      - `display_name` - the name of the user meant to be displayed in the app.
      - `email` - the email of the user tagged to this account.
    - Possible Status Codes:
      - `200` - successful
      - `400` - provided email is invalid
      - `404` - `email` for `user` does not exist
      - `500` - internal server error
  - Example:
    - Usage:
      ```
      curl http://localhost:8080/users?email=test_user@email.com
      ```
    - Result:
      ```
      {
        "id": 1,
        "email": "test_user@email.com",
        "display_name": "Test User"
      }
      ```

## `migrations`:

The flowchart did not seem to require me to implement a database (yes, I noticed that), but I could not help but wonder what it was like to create a migration in Go and use it alongside a Dockerized database, as well as think through some pointers as to what could be possible to help enhance the developer experience, productivity and minimise disruptions to operations. I also felt like it might be a good primer to at least demonstrate some form of basic proficiency with SQL and how to integrate these migrations with the app in day-to-day tasks. There are `*.up.sql` and `*.down.sql` files, with `*.up.sql` files meant to apply the migration and `*.down.sql` files to undo said migration. These migrations were implemented using [golang-migrate](https://github.com/golang-migrate/migrate).

## `scripts`:

These scripts are built to help make combinations of commands to run a certain task easier by abstracting them into a singular commands. There should be four scripts in this folder:

- `create_domain.sh <your_domain_name>` - This command will create a folder called `./src/domains/<domain_name>` and create the subfolders mentioned in [`domains`](##domains).
- `create_migration.sh <your_migration_name>` - This command creates a migration in the `./migrations` folder. Note that the naming convention of each migration is as such:

```
version_number_<your_migration_name>.[up,down].sql
```

- `integration_test.sh` - This command runs an integration test for all `*_test.go` files in the backend. Note that this spins up a containerized database and applies the migration on this database for the test, and then destroys this container when all tests have ended.

- `run_migration.sh <your_database_url>` - This command applies the selected migration on `<your_database_url>`. The selection can be done via referring to the documentations for [golang-migrate](https://github.com/golang-migrate/migrate).

## `shared`:

This folder contains the following subdirectories:

- `infrastructure` - This folder contains implementations and infrastructural code that is pertinent to the functionality of the app and avoid some code repetitions. In particular, the following subdirectories are in the `infrastructure` folder:

  - `cache` - This contains an implementation to initialize as well as retrieve the connection to the cache in order to set/ retrieve values stored in-memory (yes, I was fiddling around with this because I was curious and could not help but wonder what it might be like as a starter when applying the rules prior to making a loan application, especially when the rules looped within the backend only based on the flow diagram)
  - `database` - This contains an implementation to initialize the database connection as well as retrieve it to make the necessary queries
  - `interfaces` - This contains an implementation to retrieve the entity using generics to avoid code repetition across multiple entities
  - `logger` - This contains an implementation of a logger used within the app
  - `tests` - This contains implementations to initialize and run the various tests within the app

- `services` - This contains the service meant for the `accounting_software` as well as the `decision_engine`. It is abstracted away from the main code in order to show some form of separation of concerns.
- `utils` - This contains functions that are used in applying the rules critical to the business logic that may have happened to have occur across various domains. These functions are placed here to avoid code repetition for rules that do not change.

## How-tos

This section is a step-by-step on how to run certain basic operations.

- ### Creating a new domain:

  The script to create a new domain exists in `./scripts/create_domain.sh` and can be called as follows in the main app directory:

  ```
  ./scripts/create_domain.sh <name_of_domain>
  ```

  This will create a folder corresponding to `name_of_domain` with the following contents:

  - `subdomains/` directory
  - `routes/` directory
  - `schemas/` directory
  - `queries/` directory
  - `validators/` directory
  - `main_test.go`
  - `main.go`

  Delete any folders here that are not applicable to the context of `name_of_domain`.

  To create a new domain called `new_domain`, run the command below:

  ```
  ./scripts/create_domain.sh new_domain
  ```

- ### Creating a new database migration:

  The script to create a new migration exists in `./scripts/create_migration.sh` and can be called as follows in the main app directory:

  ```
  ./scripts/create_migration.sh [NAME_OF_MIGRATION]
  ```

  This will create two files: `[migration_number]_[name_of_migration].up.sql` and `[migration_number]_[name_of_migration].down.sql`.

  To create a migration called `test_migration`, run the command below:

  ```
  ./scripts/create_migration.sh test_migration
  ```

- ### Applying a database migration:

  The script to applying a database migration exists in `./scripts/run_migration.sh` and can be called as follows in the main app directory:

  ```
  ./scripts/run_migration.sh [POSTGRES_USER] [POSTGRES_PASSWORD] [DATABASE_URL] [DATABASE_NAME]
  ```

  Note that this script only runs the latest migration. Documentations to troubleshoot a failing migration or run any migrations not running in the order provided in the `./migrations` folder can be found in the [golang-migrate](https://github.com/golang-migrate/migrate) documentations.

  To run all migrations on a `loan_app` database at `localhost:5432` with the default `postgres` user with password set as `password`, run the command below:

  ```
  ./scripts/run_migration.sh postgres password localhost:5432 loan_app
  ```

- ### Running an integration test:

  The script to run an integration test exists in `./scripts/run_integration_test.sh` and can be called as follows:

  ```
  ./scripts/run_integration_test.sh [POSTGRES_USER] [POSTGRES_PASSWORD] [DATABASE_URL] [DATABASE_NAME]
  ```

  The integration test will spin up another database container that will be populated with `*.up.sql` files in `./migrations` and then tested along with it. The purpose of spinning up another database container and testing accordingly is to have thought through various test scenarios while validating the database connection and subsequent queries. **Note that the integration test does not use the cache at all.**

  To run the integration test on a `loan_app` database at `localhost:5435` with the default `postgres` user with password set as `password`, follow the steps below:

  1.  Create the environment file, `test.env` as shown below:

      ```
      cp example.env test.env
      ```

  2.  For `test.env`, fill the fields as shown below:

      ```
      APP_URL=localhost:8080
      APP_ENV=test
      DATABASE_URL=postgresql://postgres:password@localhost:5435/loan_app?connect_timeout=10&sslmode=disable
      CACHE_URL=
      ```

  3.  Run the command below:
      ```
      ./scripts/run_integration_test.sh postgres password localhost:5435 loan_app
      ```

- ### Run the app locally

  The backend can also be run locally. Follow the steps below to run the app locally:

  1.  Create the environment file, `development.env` as shown below:

      ```
      cp example.env development.env
      ```

  2.  For `development.env`, fill the fields as shown below:

      ```
      APP_URL=localhost:8080
      APP_ENV=development
      POSTGRES_DB=loan_app
      POSTGRES_PASSWORD=password
      DATABASE_URL=postgres://postgres:password@localhost:5432/loan_app?connect_timeout=10&sslmode=disable
      CACHE_URL=localhost:6379
      ```

  3.  Start the development database and cache by running the command below:

      ```
      sh ./scripts/create_dev_environment.sh
      ```

      **IMPORTANT: Only proceed to the next step if the database and cache are set up properly. You can do so by running `docker ps`.**

  4.  Start the app locally by running the command below:

      ```
      go run main.go
      ```

- ### Deploying the containerized app

  Refer to the **Deploy the app** section in [README.md](../README.md) in the main app directory.

- ### Stopping the containerized app

  Refer to the **Stop the app** section in [README.md](../README.md) in the main app directory.
