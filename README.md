<h1 align="center">📝 Blogify</h1>
<h3 align="center">A modern full-stack blogging platform built with the MERN stack</h3>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-20.5.1-green?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/Express.js-4.18.2-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb" />
</p>

---

## 🚀 Features

- 🧑‍💻 Full Authentication (JWT + Secure Cookies)
- ✍️ Rich blog editor powered by CKEditor
- 📂 Image Uploads via Cloudinary
- 🌐 Dynamic routing with React Router
- ❤️ Like system with optimistic UI and Redux
- 🔍 Blog Search, Categories & Tags
- 🧠 AI-Powered Summary (planned)
- 📢 Responsive UI with Tailwind CSS + ShadCN
- 🔐 Protected Routes & Role-based Access
- 🔄 State Persistence via Redux Persist

---

## 🖼️ Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/ab1bf913-7ce6-4905-873c-60f9a74ccc4c" width="60%" alt="Home Page" />
  <br/>
  <img src="https://github.com/user-attachments/assets/4793e69c-fb86-45ec-9578-c71c917aa6ff" width="60%" alt="Blog Page" />
  <br/>
  <!-- <img src="https://github.com/user-attachments/assets/YOUR-DASHBOARD-ID" width="80%" alt="Dashboard" /> -->
</p>


---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Auth | Storage | Styling | Others |
|----------|---------|----------|------|---------|---------|--------|
| React, Redux Toolkit, React Router | Node.js, Express.js | MongoDB, Mongoose | JWT, Cookies | Cloudinary | Tailwind CSS, ShadCN, Framer Motion | Zod, React Hook Form, Toastify |

---

## ⚙️ Getting Started

### 📦 Prerequisites

- Node.js & npm
- MongoDB Atlas or local MongoDB
- Cloudinary account

### 🔧 Setup

```bash
# Clone the repository
git clone https://github.com/Chetan1780/blogify.git
cd blogify

# Install backend dependencies
cd BackEnd
npm install
cp .env.example .env # Fill in credentials

# Install frontend dependencies
cd ../FrontEnd
npm install

# Start backend
cd BackEnd
npm start

# Start frontend
cd ../FrontEnd
npm run dev
