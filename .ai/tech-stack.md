# Tech Stack Summary for HR Helper Project

## Frontend
- **Framework:** Next.js (leveraging built-in API routes for MVP)
- **Language:** TypeScript 5.7+ (with strict mode enabled)
- **Styling:** To be determined (e.g., CSS Modules, Tailwind CSS)
- **Authentication:** Integration with Supabase Auth and/or NextAuth.js

## Backend
- **Framework:**
  - Primary: Next.js API Routes for rapid MVP development  
  - Alternative: NestJS for a more modular architecture as the project scales
- **Database:** PostgreSQL (managed via Supabase)

## Testing
- **Automated Testing:** Playwright for end-to-end testing

## CI/CD and Deployment
- **Source Control:** GitHub
- **CI/CD:** GitHub Actions (for builds, tests, and deployment automation)
- **Hosting:**
  - **Vercel:** For hosting the Next.js application
  - **Supabase Edge Functions:** As an alternative for serverless functions deployment

## Additional Tools
- **IDE:** Visual Studio Code
- **Code Assistance:** GitHub Copilot