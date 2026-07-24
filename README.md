# Household Connect

A full-stack service marketplace platform (Urban Company-style) connecting customers 
with verified service partners for home services like cleaning, repairs, and salon services.

## Tech Stack
- **Backend:** Java 21, Spring Boot, Spring Data JPA (Hibernate), Spring Security, Maven
- **Database:** MySQL
- **Frontend:** React
- **Auth:** JWT-based, issued by a separate Auth Microservice
- **Invoicing:** ASP.NET Core microservice
- **Tools:** Lombok, ModelMapper, Springdoc OpenAPI (Swagger)

## Architecture
Monolith backend (Spring Boot) + two standalone microservices:
1. **Auth Microservice** — issues JWTs for Customer/Partner login, validated statelessly by the monolith
2. **.NET Invoice Microservice** — generates invoices for completed bookings

## Modules & Features

### Users, Bookings, Payments, Reviews (Developer A)
- Customer: Book Service, View Booking, Make Payment, Review Service
- Partner: View Assigned Bookings, Accept Booking, Complete Booking
- Admin: Manage Users, Verify Partners, View Bookings

### Services, Subscription Plans, User Subscriptions (Developer B)
- Customer: Register, Login, Browse Services, Purchase Subscription
- Partner: Login (via Auth Microservice)
- Admin: Manage Services, Manage Subscription Plans

## Entity Relationship Diagram
See `docs/ER-diagram.png`

## API Endpoints (sample)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/users | Register a new user |
| POST | /api/services | Create a service (Admin) |
| GET | /api/services | List all services |
| POST | /api/subscription-plans | Create a plan (Admin) |
| POST | /api/user-subscriptions | Purchase a subscription |

Full API docs available at `/swagger-ui.html` once the app is running.

## Setup
1. Clone the repo
2. Create a MySQL database: `CREATE DATABASE householdconnect_db;`
3. Set the `DB_PASSWORD` environment variable to your MySQL password
4. Run `Application.java`
5. Backend runs on `http://localhost:8080`

## Status
🚧 In active development — CDAC final project
