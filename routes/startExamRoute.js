const express = require("express");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const {
  startExamController,
  statusExamController,
  getExamDetailsController,
  putUpdateTimeController,
  endExamController,
  addTimeController,
  subjectExamController
} = require("../controllers/StartExamController");

const router = express.Router();

router.post("/start", requireSignIn, startExamController);

router.get("/status", requireSignIn, statusExamController);

router.put('/update-time', requireSignIn, putUpdateTimeController)

router.put('/end-exam', requireSignIn, endExamController)

router.get("/details/:subjects", requireSignIn, getExamDetailsController);

// get subject wise exam details
router.get("/subject-exams/:id", requireSignIn, isAdmin, subjectExamController);

// add time and update exam status
router.put('/add-time',requireSignIn, isAdmin, addTimeController);

module.exports = router;
