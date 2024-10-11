const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    users: {
      type: mongoose.ObjectId,
      ref: "Users",
      required: true,
    },
    subjects: {
      type: mongoose.ObjectId,
      ref: "Subjects",
      required: true,
    },
    examName: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    inProgress: {
      type: Boolean,
      default: false,
    },
    resultStatus:{
      type:Boolean,
      default:false
    },
    results:{
      type:mongoose.ObjectId,
      ref: 'Results'
    },
    time: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exams", ExamSchema);
