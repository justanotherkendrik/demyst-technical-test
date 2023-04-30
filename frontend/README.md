# Frontend

The frontend is a simple application used to allow users to make loan requests to the backend.

## Table of Contents:

- [Implementation Details](#implementation-details)
- [App Contents](#app-contents)
  - [components](#components)
  - [interfaces](#interfaces)
  - [lib](#lib)
  - [mocks](#mocks)
  - [pages](#pages)
- [How-tos](##how-tos)
  - [Run tests](#run-tests)
  - [Run the app locally](#run-the-app-locally)
  - [Deploying the containerized app](#deploying-the-containerized-app)
  - [Stopping the containerized app](#stopping-the-containerized-app)

## Implementation Details

The frontend is implemented using React and Next 13 based on the documentations found in [the provided documentation](https://react.dev/learn/start-a-new-react-project). For the UI components, most of the design considerations were abstracted away by using [React MUI](https://mui.com/).

[Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/) were used as testing frameworks.

Unlike the backend, the frontend app contains unit tests for most components. There are some interactions and behaviors within the components that were difficult to test with integration tests, and thus unit tests were developed. These test files are located adjacent to the file for which the test is relevant for. For example, `./components/BalanceSheet.tsx` has a test in `./components/BalanceSheet.test.tsx`.

Generally, tests in `./src/pages/` tend to be integration tests, and the remaining tests are unit tests.

## App Contents

This section will only discuss the files and folders inside `./src`. Inside `./src`, the following folders exist:

- `components` - this folder contains implementations of components used in the loan page.
- `interfaces` - this folder contains models that are implemented as interfaces that are used in `./components`, `./lib` and `./pages`.
- `lib` - this folder contains functions that help the client-side interact with other services.
- `mocks` - this folder contains mocks of entities that are used in testing.
- `pages` - this folder contains the implementation of the user interface for the frontend app.

## `components`

The `components` folder contains implementations of well, components that are used in the loan page. These components are implemented here to ensure that the concerns pertaining to implementing them are separated from that of the pages requiring them. Consequently, this allows them to be tested independently of the pages and helps to improve code complexity within the pages since they would have been refactored through this implementation.

## `interfaces`

The `interfaces` folder contains implementations of models that are applicable not just to entities, but also to functions, components and pages and their respective tests that happen to have fairly complex inputs. This helps to avoid long parameter lists in the implementation of components and pages while helping to ensure that the types of inputs passed into them are adhered to strictly.

## `lib`

The `lib` folder contains helper functions to make API calls to the backend, set cookies as well as make API calls to the Next server. These functions are implemented here to ensure that the concerns pertaining to calling these functions are separated from that of the components or pages requiring them. Consequently, this allows them to be tested independently of the pages or the components and helps to improve code complexity within the pages and components since they would have been refactored through this implementation.

## `mocks`

The `mocks` folder contains implementation of mocks that are used heavily for tests. As these mocks are used across different tests repetitively, putting the mocks here would avoid the need to implement them repetitively across tests.

## `pages`

Strictly speaking, only 4 pages are used: `400.js`, `500.js`, `loan.tsx` and `login.tsx`. Starting the app and accessing `http://localhost:3000` causes a redirect implemented in `next.config.js` to direct the user automatically to the login page. The implementations here are typically rendered to the user, with API calls to the Next server also implemented here in `./pages/api`. This is a consequence of the usage of Next and is based on their documentations.

## How-tos

This section is a step-by-step on how to run certain basic operations.

- ### Run tests

  These tests were implemented using Jest and React Testing Library. Follow the steps below: it suffices to just run the command below:

  1. Assert that in `example.env`, the following content exists:

     ```
     API_URL=
     ```

  2. Create a file `.env.test` ([based off here](https://nextjs.org/docs/basic-features/environment-variables)) by running the command below:

     ```
     cp example.env .env.test
     ```

  3. Fill the contents in `.env.test` as shown below:

     ```
     API_URL=http://localhost:8080
     ```

  4. Run the tests by running the command below:

     ```
     yarn test
     ```

- ### Run the app locally

  It is possible to run the app locally. Follow the steps below:

  1. Assert that in `example.env`, the following content exists:

     ```
     API_URL=
     ```

  2. Create a file `.env.local` ([based off here](https://nextjs.org/docs/basic-features/environment-variables)) by running the command below:

     ```
     cp example.env .env.local
     ```

  3. Fill the contents in `.env.local` as shown below:

     ```
     API_URL=http://localhost:8080
     ```

     You may use another URL asides from `http://localhost:8080`, but note that the backend will typically be using `http://localhost:8080` unless changes were made there.

  4. Run the app by running the command below:

     ```
     yarn dev
     ```

  5. Assert that the app runs by accessing `http://localhost:3000`.

- ### Deploying the containerized app

  Refer to the **Deploy the app** section in [README.md](../README.md) in the main app directory.

- ### Stopping the containerized app

  Refer to the **Stop the app** section in [README.md](../README.md) in the main app directory.
