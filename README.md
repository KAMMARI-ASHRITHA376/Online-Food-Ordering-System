# Foodonic – Bite Into Speed & Flavor! 🍔💨

> A React + Vite frontend for an Online Food Ordering System (OFOS) powered by a MySQL backend. This project's database is uniquely designed to support a delivery fleet of autonomous drones.

****

---

## 📜 Table of Contents

* [About The Project](#-about-the-project)
* [Features](#-features)
* [Built With](#-built-with)
* [Getting Started](#-getting-started)
    * [Prerequisites](#prerequisites)
    * [Backend Setup (MySQL)](#1-backend-setup-mysql)
    * [Frontend Setup (React)](#2-frontend-setup-react)
* [Database Design](#-database-design)
* [About the Research](#-about-the-research)

---

## 📖 About The Project

**Foodonic** is a modern, data-intensive web application for ordering food online. While it functions as a complete Online Food Ordering System (OFOS), its primary innovation is its **MySQL database schema**, which is fully integrated to manage an autonomous drone delivery fleet.

This repository contains the **React + Vite frontend**, which serves as the user interface for customers to browse menus, place orders, and track deliveries. The backend (in a separate project or folder) consists of a robust MySQL database containing all business logic, stored procedures, and triggers necessary to manage the logistical complexity of both traditional and drone-based deliveries.

### ✨ Features

* Browse dynamic restaurant menus.
* Customer account creation and login.
* Place orders and add items to a cart.
* Secure online payment processing.
* Real-time order tracking (for both human and drone deliveries).

### 🛠️ Built With

* **Frontend:** React, Vite
* **Backend:** MySQL
* **Core Concepts:** Database Management, SQL, ER Diagrams, 3NF Normalization

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

### Prerequisites

Before you begin, ensure you have the following software installed on your machine:
* **Node.js (v18+):** [Download & Install Node.js](https://nodejs.org/)
* **MySQL Server:** You must have a running MySQL server (like MySQL Community Server or XAMPP).
* **MySQL Client:** A tool to interact with your database, such as MySQL Workbench or a command-line client.

### 1. Backend Setup (MySQL)

This React application **will not work** without the database.

1.  **Start your MySQL server.**
2.  **Create the database:**
    ```sql
    CREATE DATABASE foodonic_db;
    ```
3.  **Import the database schema:**
    (You must have a `.sql` file with your `CREATE TABLE` statements. Replace `path/to/schema.sql` with the actual path to your file.)
    ```bash
    mysql -u YOUR_USERNAME -p foodonic_db < path/to/schema.sql
    ```
4.  **Import procedures & triggers (if separate):**
    (If you have other files for stored procedures, functions, or triggers, run them now.)
    ```bash
    mysql -u YOUR_USERNAME -p foodonic_db < path/to/procedures.sql
    ```

### 2. Frontend Setup (React)

1.  **Clone this repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    ```
3.  **Create an environment file:**
    Create a new file in the project's root directory named `.env.local`. This file will hold your secret keys and database credentials. **Do not** commit this file to Git.

    Copy the following into `.env.local` and add your credentials:
    ```env
    # URL for your backend API (if you have one)
    VITE_API_BASE_URL="http://localhost:8080/api"

    # Or, if React connects directly (not recommended for production)
    VITE_MYSQL_HOST="localhost"
    VITE_MYSQL_USER="root"
    VITE_MYSQL_PASS="YOUR_MYSQL_PASSWORD"
    VITE_MYSQL_DB="foodonic_db"
    ```
    *(Note: Adjust these variable names to match what your React code actually uses to connect.)*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

---

## 🗄️ Database Design

The technical core of this work is the database schema.
* **ER Diagram:** The full Entity-Relationship diagram is available in the project documentation.
    ``
* **Normalization:** The schema is normalized to the Third Normal Form (3NF) to reduce data redundancy and improve data integrity.
* **Drone Integration:** Includes novel tables (e.g., `Drones`, `DroneFlights`, `FlightStatus`) and business logic (stored procedures, triggers) to manage drone assignments, battery life, flight paths, and real-time status tracking.

---

## 🔬 About the Research

This project serves as the practical implementation for a research paper addressing the limitations of traditional, human-centric delivery models (e.g., traffic delays, high costs, limited range).

By designing a database system that fully integrates an autonomous drone fleet, this work provides a blueprint for a faster, more reliable, eco-friendly, and wider-ranging delivery service. The full paper includes a complete literature review, performance analysis of MySQL queries, and a discussion on future scalability.