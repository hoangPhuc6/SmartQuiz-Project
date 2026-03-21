const express = require('express');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, category, difficulty, questions } = req.body;

    const quiz = await Quiz.findById(req.params.id);
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

module.exports = router;