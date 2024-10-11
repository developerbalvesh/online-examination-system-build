const express = require("express");
const {
  createSubjectController,
  allSubjectController,
  deleteSubjectController,
  getSingleSubject,
  getSingleSubjectDetails,
  getSubjectName
} = require("../controllers/subjectController");
const { isAdmin, requireSignIn } = require("../middleware/authMiddleware");

const router = express.Router();

// register user
router.post("/create", requireSignIn, isAdmin, createSubjectController);

// get all
router.get("/all", requireSignIn, allSubjectController);

// get single details
router.get("/single/:id", requireSignIn, getSingleSubject);

// get name
router.get("/name/:id", getSubjectName);

// get single exam details
router.get("/single-exam/:id", requireSignIn, getSingleSubjectDetails);

// delete subject
router.delete("/delete/:id", requireSignIn, isAdmin, deleteSubjectController);

module.exports = router;
