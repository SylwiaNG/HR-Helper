# HR Helper

[![Project Status: Active](https://img.shields.io/badge/status-active-success.svg)](https://github.com/SylwiaNG/HR-Helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD: PR Validation](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF.svg)](https://github.com/SylwiaNG/HR-Helper/actions)

A web application designed to streamline the CV selection process for recruiters. It features automatic analysis of resumes based on keywords and a manual verification interface to reduce manual work and improve the efficiency of filtering candidates.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend & Database:** Supabase, PostgreSQL
- **Authentication:** Supabase Auth / NextAuth.js
- **Testing:** 
  - **Unit Tests:** Jest, React Testing Library
  - **Integration Tests:** Playwright Component Testing, Supabase Test Helpers
  - **End-to-End Tests:** Playwright
  - **Performance:** Lighthouse, Chrome DevTools
- **Deployment:** Vercel & Supabase
- **CI/CD:** GitHub Actions

## Getting Started Locally

To set up and run this project on your local machine, follow these steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/SylwiaNG/HR-Helper.git
    cd HR-Helper
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Set up your environment variables. Create a `.env.local` file in the root of the project and add the necessary keys (e.g., for Supabase).
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run the following scripts:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs the linter to check for code quality issues.
- `npm run test`: Runs unit tests with Jest.
- `npm run test:ci`: Runs tests in CI mode with coverage.
- `npm run test:e2e`: Runs end-to-end tests with Playwright.
- `npm run test:coverage`: Generates code coverage report.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Pull Request Validation

Every Pull Request to `master`/`main` is automatically validated:

✅ **Code Quality** - ESLint + TypeScript compilation check  
✅ **Unit Tests** - Jest tests with coverage reports  
✅ **E2E Tests** - Playwright tests (conditional)  
📊 **Coverage Reports** - Automated comments on PRs

**Documentation:**
- 📖 [PR Workflow Guide](./docs/pr-workflow-guide.md) - Detailed workflow documentation
- 🚀 [Quick Start](./docs/pr-workflow-quickstart.md) - How to use the workflow
- 🧪 [Testing Scenarios](./docs/pr-workflow-testing-scenarios.md) - Test cases for workflow

**Workflow Status:** ✅ Active (`.github/workflows/pr-validation.yml`)

### Local Testing Before PR

Always test locally before creating a Pull Request:

```bash
# Quick check
npm run lint && npm run test

# Full CI simulation
npm ci && npm run lint && npm run test:ci
```

## Project Scope

The primary goal of this application is to provide an efficient tool for recruiters.

### Key Features

-   **CV Dashboard:** View and manage all submitted CVs for a specific job offer.
-   **Automatic Analysis:** CVs are automatically scanned for keywords to provide a preliminary match score.
-   **Manual Verification:** Recruiters can manually accept or reject CVs, overriding the automatic suggestion.
-   **Secure Authentication:** Safe login for recruiters to access their dedicated dashboard.
-   **Offer Statistics:** A simple analytics panel showing the number of accepted and rejected CVs.

### Out of Scope (for now)

-   Comparing candidates against each other.
-   Sending automated emails to candidates.
-   Advanced sorting and reporting features.
-   A dedicated mobile application.

## Project Status

This project is currently **in active development**. The core features for the Minimum Viable Product (MVP) are being built.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

