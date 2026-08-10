# Household Connect

A full-stack service marketplace platform (Urban Company-style) connecting customers 
with verified service partners for home services like cleaning, repairs, and salon services.

## Tech Stack
- **Backend:** Java 21, Spring Boot, Spring Data JPA (Hibernate), Spring Security (JWT), Maven
- **Notification Microservice:** ASP.NET Core (.NET 8), Entity Framework Core, MailKit
- **Database:** MySQL
- **Frontend:** React (Vite)
- **Tools:** Lombok, ModelMapper, Springdoc OpenAPI (Swagger)

## Architecture

React Frontend (Admin / Customer / Partner)
│
▼
Java Spring Boot Monolith (port 8080)

JWT-based authentication & authorization
Users, Bookings, Payments, Reviews
Services, Subscription Plans, User Subscriptions
│
▼ (async REST call, non-blocking)
.NET Notification Microservice (port 5000)
Sends email notifications (Gmail SMTP via MailKit)
Structured HTML invoice-style emails for bookings/payments/subscriptions
Own Notifications table in the shared MySQL database

## Features

### Customer
- Register, Login (JWT)
- Browse Services, Book a Service
- Purchase Subscription Plans
- Make Payments, Review completed bookings
- Email notifications: account created, booking confirmed, payment success

### Partner
- Login (JWT)
- View Assigned Bookings, Accept/Complete Bookings
- Email notification when assigned a new booking

### Admin
- Manage Users, Verify Partners
- Manage Services, Manage Subscription Plans
- View & manage all Bookings (sortable by date, filterable by status)

## Notification System
A dedicated .NET microservice handles all email notifications. The Java backend 
calls it asynchronously after key events (registration, booking, payment, 
subscription purchase) — if the notification service is unavailable, the core 
operation still succeeds; the failure is only logged, never blocking the user.

## Setup

### Backend (Java)
1. Create MySQL database: `CREATE DATABASE householdconnect_db;`
2. Set the `DB_PASSWORD` environment variable
3. Run the Spring Boot application — runs on `http://localhost:8080`
4. Swagger docs: `http://localhost:8080/swagger-ui.html`

### Notification Service (.NET)
1. Navigate to `NotificationService/`
2. Update `appsettings.json` with your MySQL connection string and Gmail 
   App Password (see Google Account → Security → App Passwords)
3. Run `dotnet ef database update` to apply migrations
4. Run `dotnet run` — runs on `http://localhost:5000`

### Frontend (React)
1. Navigate to `frontend/`
2. Run `npm install`
3. Run `npm run dev` — runs on `http://localhost:5173`

## Status
🚧 CDAC final project — actively developed, second review complete
