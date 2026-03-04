🏥 Good Life Clinic – Full Stack Healthcare Appointment Platform

A modern Full-Stack Doctor Appointment Booking System that allows patients to easily book medical appointments online, manage their profiles, and connect with doctors.

The platform includes:

🧑‍⚕️ Patient portal (Frontend)

⚙️ Admin dashboard

🚀 Secure backend API

☁️ Image upload & cloud storage

🔐 Authentication system

This project demonstrates a complete MERN-style architecture with modern UI and scalable backend services.

🌐 Live Project Structure
Good-Life-Clinic
│
├── frontend/        # Patient UI (React + Vite + Tailwind)
│
├── admin/           # Admin Dashboard
│
├── backend/         # Express API + Database
│
└── README.md
🚀 Features
👨‍⚕️ Patient Side

View list of doctors

Book doctor appointments

View available booking slots

Manage personal profile

Upload profile image

Secure login/signup

View appointment history

🛠 Admin Dashboard

Add new doctors

Upload doctor images

Manage doctor profiles

View registered users

Manage appointments

Admin authentication

⚙️ Backend Features

REST API using Express.js

MongoDB database with Mongoose

Secure authentication with JWT

Password hashing with bcrypt

Image upload with Multer

Cloud storage via Cloudinary

Middleware based role protection

🧑‍💻 Tech Stack
Frontend

React.js

Vite

Tailwind CSS

React Router

Axios

Backend

Node.js

Express.js

MongoDB

Mongoose

Authentication & Security

JWT Authentication

bcrypt password hashing

validator.js

File Upload

Multer

Cloudinary

📂 Folder Structure
Frontend
frontend/
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── assets/
│   └── context/
│
├── index.html
└── vite.config.js
Backend
backend/
│
├── config/
│   ├── mongodb.js
│   └── cloudinary.js
│
├── controllers/
│   ├── adminController.js
│   └── doctorController.js
│
├── models/
│   ├── userModel.js
│   └── doctorModel.js
│
├── routes/
│   ├── adminRoute.js
│   └── doctorRoute.js
│
├── middlewares/
│   ├── authAdmin.js
│   └── multer.js
│
├── server.js
└── package.json
