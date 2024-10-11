const { default: mongoose } = require("mongoose");
const questionModel = require("../models/questionModel");
const startExamModel = require("../models/startExamModel");
const subjectModel = require("../models/subjectModel");

const startExamController = async (req, res) => {
  try {
    const { examId } = req.body;
    const users = req.user._id;
    const question = await questionModel.find({ examId });

    const isExist = await startExamModel.find({ subjects: examId, users });

    if (isExist[0]) {
      return res.status(200).send({
        success: false,
        message: "Exam is already started or ended !",
      });
    }

    if (question.length <= 0) {
      return res.status(201).send({
        success: false,
        message: "No Question in this exam",
      });
    }

    const exams = await subjectModel.findById(examId);
    const time = exams.time;
    const examName = exams.name;

    if (time <= 0) {
      return res.status(201).send({
        success: false,
        message: "Invalid Exam or time is invalid",
      });
    }

    const exam = await new startExamModel({
      users,
      subjects: examId,
      inProgress: true,
      examName,
      time,
    }).save();

    res.status(200).send({
      success: true,
      message: "Exam is starting...",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Faild to start Exam",
    });
  }
};

const statusExamController = async (req, res) => {
  try {
    const examId = req.examId;
    const users = req.user._id;
    const exams = await startExamModel.find({ users });

    res.status(200).send({
      success: true,
      exams,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "internal error",
    });
  }
};

const getExamDetailsController = async (req, res) => {
  try {
    const { subjects } = req.params;
    const exam = await startExamModel
      .find({ users: req.user._id, subjects })
      .populate("subjects");

    res.status(200).send({
      exam,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
    });
  }
};

const putUpdateTimeController = async (req, res) => {
  try {
    const { id } = req.body;
    let time = await startExamModel.findById(id);
    time = time.time;
    if (time <= 0) {
      await startExamModel.findByIdAndUpdate(id, {
        completed: true,
        inProgress: false,
        time: 0,
      });
      return res.status(200).send({
        success: false,
        message: "Exam is already ended!",
      });
    }
    time = time - 1;
    await startExamModel.findByIdAndUpdate(id, { time }, { new: true });

    res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      error,
    });
  }
};

const endExamController = async (req, res) => {
  try {
    const id = req.body.examId;
    if (!id) {
      return res.status(200).send({
        success: false,
        message: "Error while submitting exam",
      });
    }

    const over = await startExamModel.findByIdAndUpdate(id, {
      completed: true,
      inProgress: false,
      time: 0,
    });

    if (over) {
      res.status(200).send({
        success: true,
        message: "Exam submitted successfully!",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Something went wrong while submitting exam!",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      error,
      message: "Internal server error",
    });
  }
};

const subjectExamController = async (req, res) => {
  try {
    const { id } = req.params;

    const exams = await startExamModel
      .find({ subjects: id })
      .populate("subjects")
      .populate("users");

    if (!exams[0]) {
      return res.status(200).send({
        success: false,
      });
    }

    res.status(200).send({ success: true, exams });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      error,
      success: false,
    });
  }
};

// add time controller
const addTimeController = async (req, res) => {
  try {
    let { id, time } = req.body;

    if (time <= 0) {
      const updated = await startExamModel.findByIdAndUpdate(id, {
        completed: true,
        inProgress: false,
        time:0,
      });
    } else {
      const updated = await startExamModel.findByIdAndUpdate(id, {
        completed: false,
        inProgress: true,
        time,
      });
    }

    res.status(200).send({
      success: true,
      message: "Time updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
    });
  }
};

module.exports = {
  startExamController,
  statusExamController,
  getExamDetailsController,
  putUpdateTimeController,
  endExamController,
  subjectExamController,
  addTimeController,
};
