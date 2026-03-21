### SMARTQUIZ
Ứng dụng được vide code bởi Hoàng Phúc nhằm mục đích luyện tập.
---
## 📌 Features
- 🔐 Authentication (Register / Login)
- 🧠 Tạo và quản lý quiz
- 📝 Làm bài quiz
- 📊 Xem kết quả
- 🔒 Protected routes

---
## 🛠️ Tech Stack

**Frontend:**
- React.js
- HTML
- CSS
- React Router

**Backend:**
- Node.js
- MongoDB (Mongoose)

---

## 📂 Project Structure
DemoMongoDB/
├── .gitignore
├── package.json
├── package-lock.json
│
├── Client/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── package-lock.json
│
├── Server/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ ├── seed.js
│ ├── package.json
│ └── package-lock.json
│
└── README.md

---

## ⚙️ Installation

### 1. Clone repo
```bash
git clone https://github.com/your-username/your-repo.git
cd SmartQuiz-Project

### 2. Set up Backend
```bash
cd Server
npm install
npm run dev

### 3. Set up Frontend
```bash
cd Client
npm install
npm start
