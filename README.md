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
```bash
SmartQuiz-Project/
├── .gitignore
├── package.json
├── package-lock.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── package-lock.json
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ ├── seed.js
│ ├── package.json
│ └── package-lock.json
│
└── README.md
```
---

## ⚙️ Installation

### 1. Clone repo
```bash
git clone (https://github.com/hoangPhuc6/SmartQuiz-Project.git)
cd SmartQuiz-Project
```
### 2. Set up Root
```bash
npm install
```
### 3. Set up Backend
```bash
cd backend
npm install
npm run be
```
### 4. Set up Frontend
```bash
cd frontend
npm install
npm run fe
```

## 🚀 Run Project
### 1. Cài MongoDB Community Server
Link: https://www.mongodb.com/try/download/community
Sau khi tải xong
1. Mở MongoDB Compass
2. Tạo một Connection bất kì
3. Connect với Connection đó
4. Tạo file .env
Trong folder backend, tạo một file với tên .env và copy đoạn code sau:
```bash
MONGO_URI=mongodb://127.0.0.1:27017/SmartQuizDB
PORT=5000
JWT_SECRET=your_secret_key (Tự đặt, ví dụ: quiz_secret)
```

### 2. Run project
Phải chạy lệnh ở thư mục root: ../SmartQuiz-Project>
```bash
npm run dev
```
