const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  users: {
    type: mongoose.ObjectId,
    required: true,
    ref: "Users",
  },
  subjects: {
    type: mongoose.ObjectId,
    require: true,
    ref: "Subjects",
  },
  exams: {
    type: mongoose.ObjectId,
    required: true,
    ref: "Exams",
    unique: true,
  },
  selections: {
    type: [
      {
        questions: {
          type: mongoose.ObjectId,
          ref: "Questions",
          required: true,
        },
        answers: {
          type: mongoose.ObjectId,
          ref: "Answers",
          required: true,
        },
        correct: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  obtained: {
    type: Number,
    required: true,
    defult: 0,
  },
  percentage: {
    type: Number,
    required: true,
    default: 0,
  },
  result: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Results", resultSchema);
