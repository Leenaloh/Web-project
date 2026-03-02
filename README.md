# Movie Rental Web Application  


## Project Description

This project involves developing a web application that allows users to browse, search, and rent movies from the IMDb dataset. The system includes a user-friendly interface, backend services, database integration, and authentication features.

⸻

## System Architecture

The system follows a three-layer architecture:

Frontend (Angular)
→ communicates via HTTP
Backend (Spring Boot REST API)
→ communicates via JDBC
PostgreSQL Database (IMDb dataset)

Frontend runs on:
http://localhost:4200

Backend runs on:
http://localhost:8080

Database:
PostgreSQL (local instance)

Successful communication between all layers has been verified.

⸻

## Database Setup
	1.	Install PostgreSQL.
	2.	Create a database named: imdb
	3.	Import the provided schema (createtable.sql) and dataset (movie-data.sql) SQL files into the database.
	4.	Verify that the dataset is fully loaded by executing:

SELECT COUNT(*) FROM movies;

The query should return a number greater than 0, confirming that the IMDb dataset has been loaded successfully.

All schema and data-loading scripts are included in: db/

- Environment Variables
Database connection settings are provided through environment variables and are not stored in the repository.

Before starting the backend, define the following variables locally:

 - DB_URL – JDBC connection string for PostgreSQL

 - DB_USER – Database username

 - DB_PASSWORD – Database password

Example:
 DB_URL="jdbc:postgresql://localhost:5432/imdb"
 DB_USER="your_local_username"
 DB_PASSWORD="your_local_password"

These variables must be set in your local environment before running the backend server.

⸻

## Running the Backend

To start the backend server:

cd backend
./gradlew bootRun

The backend will run at:

http://localhost:8080

⸻

## Running the Frontend

To start the frontend application:

cd frontend
ng serve

If this is your first time running the project or you get dependency errors when running ng serve, install the required packages:
npm install 
ng serve

The frontend will run at:

http://localhost:4200

⸻

## Team Information

- Rowa Alshehri – Student ID: 444200723
- Reema Almunasser – Student ID: 444201088
- Noof Alkhalifa  – Student ID: 444200886
- Leen Alohali – Student ID: 444200882 
- Muntaha Alnasser– Student ID: 444200905 

## Team Distribution – Phase 2

The responsibilities for Phase 2 were distributed as follows:

| Team Member | Responsibility |
|-------------|---------------|
| Rowa Alshehri | REST API & Interface Specification |
| Reema Almunasser | REST API & Interface Specification |
| Noof Alkhalifa | Frontend Development (Angular) |
| Muntaha Alnasser | Backend Development (Spring Boot) |
| Leen Alohali | Database Setup & Management (PostgreSQL, schema & data loading) |


Phase 3 – Team Distribution

Feature & Testing Responsibilities

Team Member	Responsibilities
Rowa Alshehri	Checkout Feature + End-to-End (E2E) Testing
Muntaha Alnasser	Authentication Feature + End-to-End (E2E) Testing
Reema Almunasser	Movie Listing & Movie Details + Backend Integration Testing
Noof Alkhalifa	Cart Operations + Frontend Integration Testing
Leen Alohali	Star Feature + Stress Testing


⸻

Testing Allocation (Phase 3)
	•	Frontend Integration Testing: Noof Alkhalifa
	•	Backend Integration Testing: Reema Almunasser
	•	End-to-End (E2E) Testing: Rowa Alshehri & Muntaha Alnasser
	•	Stress Testing: Leen Alohali

⸻

How to Run Tests

⸻

Frontend (Angular)

All frontend tests are implemented using Jasmine & Karma.

1. Navigate to the frontend directory

cd frontend

2. Install dependencies

npm install --legacy-peer-deps


⸻

3. Run Unit Tests (Development Mode)

ng test

This opens a browser and runs all unit tests.

⸻

4. Run Unit Tests (CI / Headless Mode)

npx ng test --watch=false --browsers=ChromeHeadless

This simulates the GitHub Actions environment.

⸻

Frontend Integration Tests

Run a specific integration test file:

npx ng test --include="../tests/integration/<fileName>"

Example:

npx ng test --include="../tests/integration/login.integration.spec.ts"


⸻

End-to-End (E2E) Testing – Playwright

E2E tests are implemented using Playwright.

Run All E2E Tests

cd frontend
npx playwright test

Run a Specific E2E Test

npx playwright test tests/auth.e2e.spec.ts


⸻

Stress & Robustness Testing

Stress and robustness tests were performed using k6.

⸻

Stress Testing

Stress testing evaluates system performance under high concurrent load.

Configuration
	•	Virtual users ramped up to 100
	•	Duration: ~3 minutes
	•	Target: http://localhost:8080

Endpoints Tested
	•	GET /api/v1/movies
	•	GET /api/v1/movies/{id}
	•	GET /api/v1/cart
	•	POST /api/v1/cart/items
	•	POST /api/v1/cart/checkout

Metrics Monitored
	•	p95 response time
	•	Error rate
	•	Throughput

All thresholds were met and the system remained stable under high load.

⸻

Robustness Testing

Robustness testing verifies correct handling of invalid and edge-case inputs.

Configuration
	•	10 concurrent users
	•	Duration: 60 seconds
	•	Target: http://localhost:8080

Scenarios Tested
	•	Non-existing movie IDs → Expected 404
	•	Invalid query parameters → Expected 400
	•	Invalid checkout payloads → Expected 400

All invalid requests returned correct HTTP status codes, with no unexpected server failures.

⸻

Running Stress & Robustness Tests

Prerequisites
	•	Backend server running at:

http://localhost:8080


	•	k6 installed locally

Install k6 (if needed):

brew install k6


⸻

Run Stress Test

From the project root:

k6 run backend/src/test/stress/stress.js

Run Robustness Test

From the project root:

k6 run backend/src/test/robustness/robustness.js


⸻

Backend (Spring Boot)

Backend tests are implemented using JUnit + Spring Boot Test (MockMvc/WebMvcTest).

1. Navigate to backend directory

cd backend

2. Run All Backend Tests

./gradlew clean test


⸻

3. Run a Specific Test Class

Example:

./gradlew test --tests "*AuthControllerLoginTest"


⸻

4. View Test Reports

After execution, open:

backend/build/reports/tests/test/index.html


⸻

Important Notes
	•	Always run tests locally before pushing to ensure CI checks pass.
	•	GitHub Actions executes:
	•	npm ci
	•	npm run lint
	•	npx ng test --watch=false
	•	./gradlew test
	•	If tests fail locally, they will fail in CI.
	•	Use headless mode to accurately simulate CI behavior.
