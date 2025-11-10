# REST API Plan

## 1. Resources

- **Users:**
  - Managed externally via Supabase Auth.
  - Fields: `id` (UUID), `email`, `password_hash`, `role`, `created_at`.

- **Job Offers:**
  - Maps to the `job_offers` table.
  - Fields: `id`, `user_id` (foreign key to Users), `title`, `description`, `keywords`, `created_at`.

- **CVs:**
  - Maps to the `cvs` table.
  - Fields: `id`, `job_offer_id` (foreign key to Job Offers), `first_name`, `last_name`, `keywords`, `match_percentage`, `matched_keywords_count`, `status`, `created_at`.

## 2. Endpoints

### 2.1. Job Offers

- **GET /job_offers**  
  - **Description:** Retrieve a list of job offers.
  - **Query Parameters:**  
    - `user_id` (optional — filter by recruiter),
    - `page`, `pageSize` (pagination),
    - `sort` (e.g., by created_at).
  - **Response:**  
    - JSON payload with job offer entries and pagination metadata.
  - **Errors:**  
    - 400: Invalid parameters.
    - 401: Unauthenticated.
    - 403: Unauthorized (if user filtering fails).

- **POST /job_offers**  
  - **Description:** Create a new job offer.
  - **Request Payload:**  
    ```json
    {
      "user_id": "uuid-string",
      "title": "Frontend Developer",
      "description": "Detailed job description",
      "keywords": ["react", "typescript"]
    }
    ```
  - **Response:**  
    - The created job offer object with generated `id` and `created_at`.
  - **Errors:**  
    - 400: Validation errors.
    - 401/403: Authentication/authorization issues.

- **PUT/PATCH /job_offers/{id}**  
  - **Description:** Update an existing job offer.
  - **Request Payload:**  
    ```json
    {
      "title": "Senior Frontend Developer",
      "description": "Updated job description",
      "keywords": ["react", "nextjs", "typescript"]
    }
    ```
  - **Response:**  
    - Success message confirming the update.
  - **Errors:**  
    - 400: Invalid input.
    - 404: Job offer not found.
    - 401/403: Unauthorized.

- **DELETE /job_offers/{id}**  
  - **Description:** Delete a job offer.
  - **Response:**  
    - Success confirmation.
  - **Errors:**  
    - 404: Not found.
    - 401/403: Unauthorized.

- **GET /job_offers/{job_offer_id}/stats**  
  - **Description:** Retrieve aggregated statistics (total CV count, accepted, rejected) for a given job offer.
  - **Response:**  
    ```json
    {
      "total_cvs": 100,
      "accepted": 60,
      "rejected": 40
    }
    ```
  - **Errors:**  
    - 404: Not found.
    - 401/403: Unauthorized.

### 2.2. CVs (Nested Under Job Offers)

- **GET /job_offers/{job_offer_id}/cvs**  
  - **Description:** List all CVs submitted for a specific job offer.
  - **Query Parameters:**  
    - `status` (optional filter by CV status: `new`, `accepted`, `rejected`),
    - `page`, `pageSize` (pagination).
  - **Response:**  
    - Array of CV entries along with pagination data.
  - **Errors:**  
    - 400: Invalid filters.
    - 401/403: Unauthorized.

- **POST /job_offers/{job_offer_id}/cvs**  
  - **Description:** Submit a new CV for a job offer.
  - **Request Payload:**  
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "keywords": ["react", "redux"]
    }
    ```
  - **Response:**  
    - Newly created CV record.
  - **Errors:**  
    - 400: Validation fails (e.g., more than 10 keywords).
    - 401/403: Unauthorized.

- **PUT/PATCH /job_offers/{job_offer_id}/cvs/{id}**  
  - **Description:** Update CV details or manually change the CV status.
  - **Request Payload (example):**
    ```json
    {
      "status": "accepted"
    }
    ```
  - **Response:**  
    - Success confirmation.
  - **Errors:**  
    - 400: Invalid request.
    - 404: CV not found.
    - 401/403: Unauthorized.

- **DELETE /job_offers/{job_offer_id}/cvs/{id}**  
  - **Description:** Delete a CV.
  - **Response:**  
    - Success confirmation.
  - **Errors:**  
    - 404: Not found.
    - 401/403: Unauthorized.

- **POST /job_offers/{job_offer_id}/cvs/{id}/analyze**  
  - **Description:** Trigger automatic analysis for a given CV. This endpoint calculates `match_percentage` and `matched_keywords_count` based on provided keywords.
  - **Response:**  
    - CV record updated with analysis results.
  - **Errors:**  
    - 400: Analysis error.
    - 401/403: Unauthorized.

### 2.3. Authentication Endpoints

- **POST /auth/register** and **POST /auth/login**  
  - **Description:** Manage user registration and login. (Note: These may be handled directly by Supabase Auth using the client SDK.)
  - **Responses and Errors:** Standard authentication responses (JWT issuance, error codes 400, 401).

## 3. Authentication and Authorization

- **Mechanism:**
  - JWT-based authentication provided by Supabase Auth.
  - API endpoints require a valid JWT token.
- **Implementation Details:**
  - Middleware to verify tokens.
  - Enforce that recruiters only access job offers and CVs they own via RLS (at the DB level) and additional API-level checks.
- **Security Measures:**
  - Rate limiting on endpoints.
  - Input validation and error handling.
  - Use of HTTPS and secure token storage.

## 4. Validation and Business Logic

- **Input Validation:**
  - Ensure that the number of keywords for CV submissions does not exceed 10.
  - Validate enum values for CV `status` (`new`, `accepted`, `rejected`).

- **Business Logic Implementation:**
  - **Automatic CV Analysis:**
    - Triggered via the POST /job_offers/{job_offer_id}/cvs/{id}/analyze endpoint.
    - Computes matching metrics based on keyword comparison.
  - **Statistics Calculation:**
    - The GET /job_offers/{job_offer_id}/stats endpoint aggregates CV data.
  - **Cascading Deletes:**
    - Deletion of a job offer automatically deletes associated CVs.

- **Error Handling:**
  - Return HTTP status codes 400, 401, 403, 404 with descriptive messages.

*Assumptions:*
- User authentication flows are primarily managed via Supabase Auth.
- The API is consumed by a Next.js frontend that uses the Supabase client for authentication and data manipulation.
- Advanced features such as rate limiting and caching will be addressed in future iterations.
