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
