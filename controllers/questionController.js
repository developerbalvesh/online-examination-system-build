const questionModel = require("../models/questionModel");

const createQuestionController = async (req, res) => {
  try {
    const { questionFinale } = req.body;

    const question = await new questionModel(questionFinale).save();
    res.status(200).send({
      success: true,
      message: "Added",
      question,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
      success: false,
      message: "Error",
    });
  }
};

const getQuestionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const questions = await questionModel
      .find({ examId: id })
      .sort({ createdAt: -1 });

    res.status(200).send({
      questions,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const searchQuestionController = async (req, res) => {
  try {
    const { search, examId } = req.body;

    const result = await questionModel
      .find({
        examId,
        $or: [
          { question: { $regex: search, $options: "i" } },
          { option1: { $regex: search, $options: "i" } },
          { option2: { $regex: search, $options: "i" } },
          { option3: { $regex: search, $options: "i" } },
          { option4: { $regex: search, $options: "i" } },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
    });
  }
};

const updateQuestionController = async (req, res) => {
  try {
    const { question, option1, option2, option3, option4, answer, _id } =
      req.body;

    const que = await questionModel.findByIdAndUpdate(
      _id,
      {
        ...req.body,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
      success: false,
      message: "Error",
    });
  }
};

const getAllQuestionsController = async (req, res) => {
  try {
    const { id, i } = req.params;

    const question = await questionModel.find({ examId: id }).select("-answer");

    res.status(200).send({
      question:question[i],
      length:question.length,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error",
    });
  }
};

module.exports = {
  createQuestionController,
  getQuestionByIdController,
  searchQuestionController,
  updateQuestionController,
  getAllQuestionsController,
};
