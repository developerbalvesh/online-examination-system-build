const express = require("express");
const { isAdmin, requireSignIn } = require("../middleware/authMiddleware");
const {
  createQuestionController,
  getQuestionByIdController,
  searchQuestionController,
  updateQuestionController,
  getAllQuestionsController,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/create", requireSignIn, isAdmin, createQuestionController);

router.get("/get-by-id/:id", requireSignIn, getQuestionByIdController);

router.get("/get-all/:id/:i", requireSignIn, getAllQuestionsController);

router.post("/search", requireSignIn, searchQuestionController);

router.put("/update", requireSignIn, isAdmin, updateQuestionController);

router.get("/get");

module.exports = router;
