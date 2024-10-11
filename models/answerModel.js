const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.ObjectId,
      ref: "Exam",
      require: true,
      unique: true,
    },
    answer: {
      type: [
        {
          questions: {
            type: mongoose.ObjectId,
            ref: "Questions",
          },
          answer: {
            type: Number,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answers", AnswerSchema);
