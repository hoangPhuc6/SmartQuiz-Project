const express = require('express');
const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/:quizId', auth, async (req, res) => {
  try {
    const { answers = [] } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const evaluatedAnswers = quiz.questions.map((question) => {
      const submitted = answers.find(
        (item) => String(item.questionId) === String(question._id)
      );

      const selectedAnswer = submitted ? submitted.selectedAnswer : '';
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += question.points || 1;
      }

      return {
        questionId: question._id,
        selectedAnswer,
        isCorrect,
      };
    });

    const attempt = await Attempt.create({
      userId: req.user.id,
      quizId: quiz._id,
      answers: evaluatedAnswers,
      score,
      totalPoints,
    });

    res.status(201).json({
      attemptId: attempt._id,
      score,
      totalPoints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/mine/history', auth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .populate('quizId', 'title category difficulty')
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/result/:attemptId', auth, async (req, res) => {
  try {
    const { attemptId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ message: 'attemptId không hợp lệ' });
    }

    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId: req.user.id,
    }).populate('quizId');

    if (!attempt) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Attempt.aggregate([
      {
        $group: {
          _id: '$quizId',
          avgScore: { $avg: '$score' },
          totalAttempts: { $sum: 1 },
          bestScore: { $max: '$score' },
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: '_id',
          as: 'quiz',
        },
      },
      { $unwind: '$quiz' },
      {
        $project: {
          _id: 0,
          title: '$quiz.title',
          avgScore: { $round: ['$avgScore', 2] },
          totalAttempts: 1,
          bestScore: 1,
        },
      },
      { $sort: { totalAttempts: -1 } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;