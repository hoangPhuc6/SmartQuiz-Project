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
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // 🔍 Kiểm tra user đã tồn tại chưa
    let user = await User.findOne({ email: demoUser.email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(demoUser.password, 10);

      user = await User.create({
        name: demoUser.name,
        email: demoUser.email,
        password: hashedPassword,
      });

      console.log('✅ Tạo user demo thành công');
    } else {
      console.log('ℹ️ User đã tồn tại, bỏ qua tạo mới');
    }

    // 🔍 Kiểm tra đã có quiz chưa (tránh duplicate)
    const existingQuiz = await Quiz.findOne({ title: 'MongoDB Basics' });

    if (!existingQuiz) {
      const quizzesWithOwner = quizzes.map(q => ({
        ...q,
        owner: user._id
      }));

      await Quiz.insertMany(quizzesWithOwner);

      console.log('✅ Seed quiz thành công');
    } else {
      console.log('ℹ️ Quiz đã tồn tại, bỏ qua seed');
    }

    console.log('🎉 Seed hoàn tất');
    console.log('Tài khoản demo: admin@gmail.com / 123456');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();