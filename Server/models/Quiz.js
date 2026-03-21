const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    points: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      default: '',
    }
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Database',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    questions: {
      type: [questionSchema],
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);