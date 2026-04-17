# User Management System (UMS)

A modern, full-stack MERN application for managing users, roles, and permissions with a premium dashboard interface.

## 🚀 Quick Start Credentials

> [!IMPORTANT]
> Use the following credentials to access the system:

### Administrator Access
- **Email**: `arjun@gmail.com`
- **Password**: `password123`
- **Role**: Full access to dashboard and user management.

### Manager Access
- **Email**: `priya@gmail.com`
- **Password**: `password123`
- **Role**: Limited access to user management.

### Standard User Access
- **Email**: `amit@gmail.com`
- **Password**: `password123`
- **Role**: Profile view only.

---

## 📸 Project Screenshots

### 1. Login Interface
![Login Page](./screenshots/login_page_1776414264790.png)

### 2. Admin Dashboard
![Admin Dashboard](./screenshots/dashboard_page_1776414291490.png)

### 3. User Management
![User Management](./screenshots/user_list_page_1776414334081.png)

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (via Prisma ORM).
- **Authentication**: JWT (JSON Web Tokens) with Secure HTTP-Only Cookies.
- **Security**: Bcrypt.js for password hashing, Express-validator for input sanitization.

---

## ✨ Key Features

- **Premium UI/UX**: Modern sidebar layout with glassmorphism effects and dynamic active states.
- **RBAC (Role-Based Access Control)**: Granular permissions for Admin, Manager, and User roles.
- **User Lifecycle Management**: Complete CRUD functionality (Create, Read, Update, Delete) with search and status filtering.
- **Account Status**: Support for Active/Inactive user states.
- **Responsive Design**: Fully optimized for various screen sizes.
- **Secure Auth**: Robust login/signup flow with JWT-based session management.

---

## ⚙️ Installation & Setup

### 1. Prerequisite
Ensure you have **Node.js** and **MongoDB** installed and running on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/surajkewat72/management-system.git
cd management-system
```

### 3. Install Dependencies
Run the following command in the root directory to install all dependencies for both frontend and backend:
```bash
npm run install-all
```

### 4. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 5. Setup Database & Seed
Run the migrations and seeding script to create the initial admin and sample users:
```bash
cd backend
npx prisma migrate dev --name init
node seed.js
```

### 6. Run the Application
Start both the backend and frontend simultaneously from the root directory:
```bash
npm run dev
```

---

## 📝 License
This project is licensed under the ISC License.
