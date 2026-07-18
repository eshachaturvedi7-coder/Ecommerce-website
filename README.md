# 🛍️ ShopEase — Full-Stack E-Commerce Platform

A complete, production-style e-commerce web application built from scratch — featuring user authentication, product management, cart & checkout flow, order tracking, and a full admin dashboard.

![Status](https://img.shields.io/badge/status-active-success)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![React](https://img.shields.io/badge/React-Vite-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

---

## ✨ Features

### 🛒 Customer Experience
- User registration & login with JWT authentication
- Browse products with category filtering
- Product detail pages with image galleries
- Add to cart, update quantities, remove items
- Secure checkout flow with shipping address
- Cash on Delivery & Razorpay payment integration
- Order history and order status tracking

### 🔐 Admin Dashboard
- Role-based access control (Admin vs User)
- Add, edit, and delete products
- Upload product images directly to Cloudinary
- View and manage all customer orders
- Update order status (Processing → Shipped → Delivered)

### ⚙️ Under the Hood
- RESTful API architecture
- Password hashing with bcrypt
- Image storage via Cloudinary
- Persistent cart tied to user accounts
- Payment signature verification (Razorpay)

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Multer + Cloudinary for image uploads
- Razorpay for payments

---

## 📁 Project Structure