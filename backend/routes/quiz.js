const express = require('express');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách quiz của user đang đăng nhập
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy chi tiết 1 quiz thuộc user đang đăng nhập
router.get('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID quiz không hợp lệ' });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo quiz mới cho user đang đăng nhập
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, difficulty, questions } = req.body;

    if (!title || !questions || !questions.length) {
      return res.status(400).json({ message: 'Thiếu dữ liệu quiz' });
    }

    const quiz = await Quiz.create({
      title,
      category,
      difficulty,
      questions,
      owner: req.user.id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật quiz chỉ khi đúng chủ sở hữu
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, category, difficulty, questions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID quiz không hợp lệ' });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }

    quiz.title = title;
    quiz.category = category;
    quiz.difficulty = difficulty;
    quiz.questions = questions;

    await quiz.save();

    res.json({ message: 'Cập nhật quiz thành công', quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa quiz chỉ khi đúng chủ sở hữu
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID quiz không hợp lệ' });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Xóa quiz thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;