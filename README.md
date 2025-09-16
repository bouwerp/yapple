# Yapple - Global User Hierarchy 

## Description

Yapple is a global user hierarchy system for the secure management of users at national, urban and suburban level. The system consts of:
1. Management Portal: A web application for securely querying and browsing users.
2. CLI: A command line interface for securely managing users and their permissions.
3. API: The REST API backing the management portal and the CLI.

## To-do

- [ ] UI Design for management portal
- [ ] CLI Design
- [ ] API Design
- [ ] API Implementation
- [ ] CLI Implementation
- [ ] Management Portal Implementation

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e kitchen-sink
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `api`: an [Express](https://expressjs.com/) server
- `admin`: a [Vite](https://vitejs.dev/) single page app
- `@repo/eslint-config`: ESLint configurations used throughout the monorepo
- `@repo/jest-presets`: Jest configurations
- `@repo/ui`: a dummy React UI library (which contains `<CounterButton>` and `<Link>` components)
- `@repo/typescript-config`: tsconfig.json's used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
