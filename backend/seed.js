const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Quiz = require('./models/Quiz');

dotenv.config();

const demoUser = {
  name: 'Demo Admin',
  email: 'admin@gmail.com',
  password: '123456'
};

const quizzes = [
  {
    title: 'MongoDB Basics',
    category: 'Database',
    difficulty: 'easy',
    questions: [
      {
        content: 'MongoDB là loại cơ sở dữ liệu gì?',
        options: ['Relational', 'Document', 'Graph', 'Key-value'],
        correctAnswer: 'Document',
        explanation: 'MongoDB là document database.',
        points: 1
      },
      {
        content: 'MongoDB lưu dữ liệu theo cấu trúc nào?',
        options: ['Row', 'Document', 'Table', 'Cell'],
        correctAnswer: 'Document',
        explanation: 'MongoDB lưu dữ liệu giống JSON document.',
        points: 1
      },
      {
        content: 'Điểm mạnh nổi bật của MongoDB trong demo này là gì?',
        options: ['Join phức tạp', 'Schema cứng', 'Lưu nested document tốt', 'Không hỗ trợ mảng'],
        correctAnswer: 'Lưu nested document tốt',
        explanation: 'Quiz có thể lưu nhiều câu hỏi trong cùng 1 document.',
        points: 1
      }
    ]
  },
  {
    title: 'React + Node.js',
    category: 'Web',
    difficulty: 'medium',
    questions: [
      {
        content: 'React chủ yếu dùng để làm gì?',
        options: ['Xử lý DB', 'Xây dựng UI', 'Chạy MongoDB', 'Quản lý hệ điều hành'],
        correctAnswer: 'Xây dựng UI',
        explanation: 'React là thư viện xây dựng giao diện.',
        points: 1
      },
      {
        content: 'Node.js dùng để làm gì?',
        options: ['Làm frontend thuần', 'Chạy JavaScript phía server', 'Thiết kế ảnh', 'Thay CSS'],
        correctAnswer: 'Chạy JavaScript phía server',
        explanation: 'Node.js cho phép chạy JS ở backend.',
        points: 1
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Quiz.deleteMany();

    const hashedPassword = await bcrypt.hash(demoUser.password, 10);
    await User.create({
      name: demoUser.name,
      email: demoUser.email,
      password: hashedPassword,
    });

    await Quiz.insertMany(quizzes);

    console.log('Seed thành công');
    console.log('Tài khoản demo: admin@gmail.com / 123456');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();