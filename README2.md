
# Flash Sale App ⚡🛒

## Overview

The **Flash Sale App** is a web-based e-commerce system designed to handle situations where a **large number of users attempt to purchase a limited product at the same time**.

In flash sale events, products are often available in **very small quantities**, while **thousands of users attempt to buy them simultaneously**. This can create problems such as overselling, negative inventory, and failed orders.

This project ensures that:

* Products can only be purchased while stock is available.
* Once the product quantity reaches **zero**, the system automatically displays **"Out of Stock"**.
* This prevents users from placing orders for unavailable items and helps maintain accurate inventory.

The application demonstrates how an online shopping platform can manage **high-demand limited products** efficiently during flash sales.

🌐 **Live Project:**
https://flash-sparkle-shop.vercel.app/

---

## Problem Statement

Flash sales create extremely high traffic in a short period of time. When inventory is limited, several issues may occur:

* Multiple users try to purchase the same product simultaneously.
* Orders may be placed even when inventory is already sold out.
* Systems may display incorrect stock availability.

The **Flash Sale App** addresses these issues by ensuring proper inventory checks and preventing purchases when stock becomes unavailable.

---

## Key Features ✨

### 1. Limited Product Availability

Products have a **fixed stock quantity**, ensuring only a limited number of purchases can occur.

### 2. Real-Time Stock Management

The system automatically updates stock after each successful purchase.

### 3. Out-of-Stock Detection

When the product quantity reaches zero, the application displays **Out of Stock** to prevent further purchases.

### 4. Flash Sale Simulation

Simulates the scenario where many users attempt to buy a product simultaneously.

### 5. User-Friendly Interface

A simple and clean UI helps users easily view product details and availability.

---

## System Architecture 🏗️

The application follows a **full-stack architecture** consisting of three main components:

### Frontend

Responsible for displaying product information and user interaction.

Technologies used:

* HTML
* CSS
* JavaScript

### Backend

Handles the core logic of the application including:

* Inventory checking
* Purchase processing
* Stock updates

Technologies used:

* Node.js
* Express.js

### Database

Stores product information and inventory data.

Options used:

* MongoDB
  or
* MySQL

---

## Project Workflow ⚙️

1. The user visits the Flash Sale App.
2. The product page displays the available product and stock quantity.
3. When a user clicks **Buy Now**, a request is sent to the backend server.
4. The server checks the database for available stock.
5. If stock is available:

   * The purchase is completed.
   * Stock is reduced by one.
6. If stock becomes zero:

   * The system displays **Out of Stock**.
   * No additional purchases are allowed.

This workflow ensures **inventory consistency and prevents overselling**.

---

## Technologies Used 💻

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB / MySQL

---
## Project Structure 📁

The project is organized into frontend, backend, and database components to maintain a clean and scalable architecture.

flash-sale-app
│
├── frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend
│   ├── server.js
│   ├── routes
│   └── controllers
│
├── database
│
└── README.md


## Installation and Setup 🚀

To run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/codesmasher06/flash-sale-app.git
```

### 2. Navigate to project folder

```bash
cd flash-sale-app
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

### 5. Open the application

Open your browser and visit:

```
http://localhost:3000
```

---

## Future Improvements 🔮

* Add user authentication and login system
* Implement payment gateway integration
* Add queue management for high traffic
* Improve real-time inventory handling
* Add order tracking system

---

## Learning Outcomes 📚

Through this project, the following concepts were explored:

* Flash sale system design
* Handling limited inventory in e-commerce
* Backend API development using Node.js and Express
* Database integration
* Full-stack web development

---

## Author 👩‍💻

**Manashree Digamber Thakur**
Computer Engineering Student
Usha Mittal Institute of Technology

GitHub: https://github.com/codesmasher06/flash-sparkle-shop

---

## Conclusion

The **Flash Sale App** demonstrates how an online shopping platform can handle **high-demand limited products** efficiently. By ensuring proper stock validation and preventing overselling, the system improves reliability and enhances the user experience during flash sale events.

---

