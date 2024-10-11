const express = require("express");
const { requireSignIn } = require("../middleware/authMiddleware");
const {
  startAnswerController,
  uploadExamController,
  getSelectedAnswer,
} = require("../controllers/answerController");

const router = express.Router();

router.post("/start", requireSignIn, startAnswerController);

router.put("/upload", requireSignIn, uploadExamController);

router.post("/existed-answer", requireSignIn, getSelectedAnswer);

module.exports = router;
