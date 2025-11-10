# Tech Stack Summary for HR Helper Project

## Frontend
- **Framework:** Next.js (using App Router with experimental Turbopack for fast builds)
- **Language:** TypeScript 5.7+ (with strict mode enabled)
- **Styling:** Tailwind CSS
- **Authentication:** Integration with Supabase Auth and/or NextAuth.js

## Backend
- **Framework:**
  - Primary: Supabase Functions for rapid MVP development
- **Database:** PostgreSQL (managed via Supabase)

## Testing
- **Automated Testing:** Playwright for end-to-end testing
- **Unit Testing Framework:** Jest (built into Next.js)
- **Component Testing:** React Testing Library
- **Integration Testing:** Playwright Component Testing, Supabase Test Helpers
- **API Mocking:** MSW (Mock Service Worker)
- **Performance Testing:** Lighthouse, Chrome DevTools, k6
- **Visual Regression:** Percy/Chromatic (optional)
- **Security Testing:** OWASP ZAP, Supabase RLS testing
- **Coverage Target:** Minimum 70% for business logic layer

## CI/CD and Deployment
- **Source Control:** GitHub
- **CI/CD:** GitHub Actions (for builds, tests, and deployment automation)
- **Hosting:**
  - **Vercel:** For hosting the Next.js application
  - **Supabase Edge Functions:** As an alternative for serverless functions deployment

## Additional Tools
- **IDE:** Visual Studio Code
- **Code Assistance:** GitHub Copilot
- **Linting:** ESLint