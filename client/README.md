# ECommerceApp Frontend

This project is an Angular-based E-Commerce Application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Server](#development-server)
- [Code Scaffolding](#code-scaffolding)
- [Build](#build)
- [Running Tests](#running-tests)
- [Running End-to-End Tests](#running-end-to-end-tests)
- [Docker Setup](#docker-setup)
- [Further Help](#further-help)

## Prerequisites

- Node.js (>=18.x)
- Angular CLI (>=17.2.1)
- PNPM (9.0.5)

## Development Server

To start the development server, run:

- ng serve
  Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

## Code Scaffolding

You can generate a new component using:
ng generate component component-name

You can also use other schematics like `directive`, `pipe`, `service`, `class`, `guard`, `interface`, `enum`, or `module`.

## Build

To build the project, run:

- ng build

The build artifacts will be stored in the `dist/` directory.

## Running Tests

- ng test

## Running End-to-End Tests

To execute end-to-end tests, you need to first add a package that implements end-to-end testing capabilities. Then, run:
ng e2e

## Docker Setup

This project can be easily containerized using Docker. The Dockerfile provided in the repository sets up the environment for running the Angular app in a production-ready manner.

To build the Docker image, run:
docker build -t e-commerce-app .

To run the Docker container, use:
The application will be accessible at `http://localhost`.

## Further Help

For more help on the Angular CLI, use:
The application will be accessible at `http://localhost`.

## Further Help

For more help on the Angular CLI, use:

- ng help

Or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
