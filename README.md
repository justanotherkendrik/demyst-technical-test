# Demyst Technical interview

Hi! This is my take on the loan application for the technical interview... Which I unfortunately have not used an app to make a loan before (or make a loan).

## Table of Contents:

- [App Contents](#app-contents)
- [Implementation Details](#implementation-details)
- [How-tos](##how-tos)
  - [Deploy the app](#deploy-the-app)
  - [Stop the app](#stop-the-app)

## App Contents

This app should have the following contents:

- `backend` - This folder contains the implementation for the backend.
- `frontend` - This folder contains the implementation for the frontend.
- `scripts` - This folder contains scripts that help to streamline the usability of the app.
- `.gitignore` - Uhhh well... Some stuff really should not be pushed up, so...
- `backend.env.example - An example of `backend.env` that exists in this directory.
- `frontend.env.example` - An example of `frontend.env` that exists in this directory.
- `docker-compose.backend.yml` - The docker compose configuration for the `backend`.
- `docker-compose.frontend.yml` - The docker compose configuration for the `frontend`.

## Implementation Details

Refer to `./backend` and `./frontend` for their respective implementation details. Both `backend` and `frontend` have their own respective Docker Compose files which use the same Dockerfiles as that of the Docker Compose files in this directory.

## How-tos

- ### Deploy the app

  The script that can be used to immediately deploy the app is located in `./scripts/deploy_app.sh`. Prior to running the app, ensure that the following steps are followed:

1. Assert that `backend.env.example` and `frontend.env.example` exist in this directory and have the following contents:

   `backend.env.example`

   ```
   APP_URL=
   APP_ENV=
   DATABASE_URL=
   CACHE_URL=
   ```

   `frontend.env.example`

   ```
   API_URL=
   ```

2. Create two files, `backend.env` and `frontend.env` as shown below:

   ```
   cp backend.env.example backend.env
   cp frontend.env.example frontend.env
   ```

3. For `backend.env`, fill the fields as shown below:

   ```
   APP_URL=0.0.0.0:8080
   APP_ENV=container
   DATABASE_URL=postgres://postgres:password@demyst-technical-test-db-1:5432/loan_app?connect_timeout=10&sslmode=disable
   CACHE_URL=demyst-technical-test-cache-1:6379
   ```

4. For `frontend.env`, fill the fields as shown below:

   ```
   API_URL=http://demyst-technical-test-backend-1:8080
   ```

5. Run `./scripts/deploy_app.sh` as shown below:

   ```
   ./scripts/deploy_app.sh
   ```

   The above command will deploy **BOTH** the `frontend` and the `backend` app. For `./scripts/deploy_app.sh`, the same command can be used to deploy either the `frontend` or the `backend` only. Given that you would like to deploy only the `backend` app, the command can be run as follows:

   ```
   ./scripts/deploy_app.sh backend
   ```

   To deploy `frontend` instead, you may replace `backend` in the command above with `frontend`.

6. Perform database migrations:

   You might be tempted to make an API call here, but the tables and schemas have not been set up yet. Doing so will result in an Internal Server Error when making any API call. Follow the steps mentioned below:

   1. From the app's root directory (which you should still be in), change directory to the `backend` app using the command below:

      ```
      cd backend
      ```

   2. Run the migration script using the command below:

      ```
      ./scripts/run_migration.sh postgres password localhost:5432 loan_app
      ```

   3. Make an example API call as shown below:

      ```
      curl http://localhost:8080/businesses
      ```

      Assert that no error is raised and a status 200 is retrieved.

- ### Stop the app

  The script that can be used to immediately deploy the app is located in `./scripts/stop_app.sh`, and can be called as shown below:

  ```
  ./scripts/stop_app.sh
  ```

  This command functions similarly to `./scripts/deploy_app.sh`. It accepts a single argument that is used to decide which app to stop.
