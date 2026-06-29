# 🌿 GoodLife Clinic — AI Powered Smart Healthcare Platform

<p align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=30&duration=3000&pause=800&color=00E5FF&center=true&vCenter=true&width=1000&lines=Modern+Doctor+Appointment+Booking+Platform;AI-Integrated+Healthcare+Management+System;Secure+MERN+Stack+Healthcare+Application;Transforming+Healthcare+Digitally+🚀"/>

</p>

---

<p align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,25:2563eb,50:06b6d4,75:14b8a6,100:22c55e&height=180&section=header&text=GoodLife%20Clinic&fontSize=45&fontColor=ffffff&animation=fadeIn&fontAlignY=35"/>

</p>

---

<p align="center">

<img src="https://img.shields.io/badge/MERN-Stack-success?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Authentication-JWT-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Image%20Storage-Cloudinary-orange?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Email-Brevo-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-success?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge"/>

</p>

---

# 🌟 Overview

**GoodLife Clinic** is a modern, AI-ready healthcare management and doctor appointment booking platform developed using the **MERN Stack**. It digitizes the complete appointment workflow by providing secure authentication, real-time appointment scheduling, doctor management, cloud-based media storage, and a responsive user experience.

The platform has been designed with scalability, modular architecture, and security in mind so that it can evolve into a complete digital healthcare ecosystem.

---

# 🎯 Project Objectives

* Digitize the appointment booking process.
* Reduce manual scheduling conflicts.
* Provide patients with a simple healthcare experience.
* Give administrators centralized control over doctors and appointments.
* Build a scalable backend ready for future AI integration.
* Deliver a secure, cloud-hosted healthcare platform.

---

# 🚀 Key Features

## 👤 Patient Portal

* Secure User Registration
* JWT Authentication
* Login & Logout
* Profile Management
* Profile Photo Upload (Cloudinary)
* Browse Doctors
* Search Doctors by Specialty
* View Doctor Profiles
* Book Appointments
* Real-Time Slot Availability
* Prevent Double Booking
* View Appointment History
* Cancel Appointments
* Responsive Mobile Interface

---

## 👨‍⚕️ Doctor Management

* Doctor Profiles
* Professional Details
* Experience Information
* Consultation Fee
* Specialty Management
* Profile Image Upload
* Availability Toggle
* Appointment Visibility

---

## 🛠️ Admin Dashboard

* Secure Admin Login
* Add New Doctors
* Upload Doctor Images
* Manage Doctor Availability
* View All Doctors
* Monitor Patient Appointments
* Protected Admin APIs
* Dashboard Statistics Ready

---

## ☁️ Cloud Features

* MongoDB Atlas Database
* Cloudinary Image Storage
* Render Backend Deployment
* Vercel Frontend Deployment
* Brevo Email Integration
* RESTful API Architecture

---

# 🔐 Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected API Routes
* Admin Authorization
* Input Validation
* Secure Environment Variables
* Cloud Image Storage
* CORS Protection

---

# ⚙️ Technology Stack

## Frontend

* React.js
* React Router DOM
* Context API
* Axios
* Tailwind CSS
* Vite

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Validator
* Multer
* Cloudinary
* Brevo Email API

---

## Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas
* Cloudinary
* Brevo

---

# 🏗️ System Architecture

```mermaid
flowchart LR

A[Patient]
-->B[React Frontend]

B-->C[Express REST API]

C-->D[JWT Authentication]

D-->E[MongoDB Atlas]

C-->F[Cloudinary]

C-->G[Brevo Email API]

E-->H[Appointment Data]

F-->I[Profile Images]

G-->J[Notifications]
```

---

# ⚡ Application Workflow

```mermaid
flowchart TD

A[User Registration]
-->B[JWT Authentication]

B-->C[Login]

C-->D[Browse Doctors]

D-->E[View Doctor Profile]

E-->F[Select Date]

F-->G[Choose Time Slot]

G-->H[Slot Validation]

H-->I[Book Appointment]

I-->J[MongoDB Storage]

J-->K[Patient Dashboard]

K-->L[Appointment Management]

L-->M[Cancel Appointment]
```

---

# 📂 Project Structure

```
Good-Life-Clinic
│
├── frontend
│   ├── components
│   ├── context
│   ├── pages
│   ├── assets
│   └── App.jsx
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   └── server.js
│
├── admin
│   ├── pages
│   ├── components
│   └── App.jsx
│
└── README.md
```

---

# 📸 Application Screenshots

## 🏠 Home Page

<p align="center">

<img src="screenshots/home.png" width="900"/>

</p>

---

## 👨‍⚕️ Doctors Page

<p align="center">

<img src="screenshots/doctors.png" width="900"/>

</p>

---

## 📅 Appointment Booking

<p align="center">

<img src="screenshots/booking.png" width="900"/>

</p>

---

## 👤 Patient Dashboard

<p align="center">

<img src="screenshots/profile.png" width="900"/>

</p>

---

## 🛠️ Admin Dashboard

<p align="center">

<img src="screenshots/admin-dashboard.png" width="900"/>

</p>

---

## 📱 Mobile Responsive Design

<p align="center">

<img src="screenshots/mobile-home.png" width="280"/>
<img src="screenshots/mobile-menu.png" width="280"/>

</p>

---

# 🌱 Future Enhancements

* AI Symptom Checker
* AI Health Assistant
* WhatsApp Appointment Booking
* Online Video Consultation
* Payment Gateway Integration
* Doctor Ratings & Reviews
* Digital Medical Records
* Email Appointment Reminders
* SMS Notifications
* Forgot Password via Secure Email Link
* Email Verification
* Google Login
* Two-Factor Authentication (2FA)
* Multi-language Support
* Dark & Light Theme
* Analytics Dashboard
* Prescription Management
* Medical Report Upload
* QR Code Check-in
* Progressive Web App (PWA)
* Mobile Application (Android & iOS)

---

# 📈 Current Project Status

| Module                   | Status         |
| ------------------------ | -------------- |
| Patient Portal           | ✅ Completed    |
| Admin Dashboard          | ✅ Completed    |
| Doctor Management        | ✅ Completed    |
| JWT Authentication       | ✅ Completed    |
| Cloudinary Integration   | ✅ Completed    |
| Appointment Booking      | ✅ Completed    |
| Appointment Cancellation | ✅ Completed    |
| Responsive Design        | ✅ Completed    |
| Brevo Email Service      | ✅ Completed    |
| Production Deployment    | ✅ Completed    |
| Forgot Password          | 🚧 In Progress |
| AI Features              | 🔜 Planned     |

---

# 👨‍💻 Developer

**Saket Bishnu**

Software Engineer | MERN Stack Developer | Machine Learning Enthusiast

---

<p align="center">

⭐ If you found this project useful, consider giving it a star on GitHub!

</p>
