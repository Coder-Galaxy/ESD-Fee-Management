# ESD Fee Management System

A comprehensive Fee Management System built for educational institutions to manage student fees, bills, and payments.

## 🚀 Technology Stack

- **Backend:** Java (Spring Boot), Hibernate, MySQL
- **Frontend:** React.js, Node.js
- **Database:** MySQL

## 📋 Prerequisites

Ensure you have the following installed:
- Java Development Kit (JDK) 17 or later
- Node.js and npm
- MySQL Server

## 🛠️ Setup Instructions

### 1. Database Setup
1. Open your MySQL client (Workbench or CLI).
2. Create a new database named `esd_project`.
3. The application is configured to automatically create tables (`ddl-auto=create`) and seed initial data.

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Open `src/main/resources/application.properties` and update your MySQL username and password if different from default:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

## 🔑 Default Credentials

The system comes with a pre-configured admin account for testing:

- **Role:** Accounts Admin
- **Email:** `accounts-admin@esd.edu`
- **Password:** `admin123`

## 📝 Features

- **Admin Dashboard:** Manage fees, view student bills.
- **Student Portal:** View pending bills, payment history.
- **Authentication:** Secure login for admins and students.
