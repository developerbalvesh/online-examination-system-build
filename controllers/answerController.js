const answerModel = require("../models/answerModel");
const startExamModel = require("../models/startExamModel");

const startAnswerController = async (req, res) => {
  try {
    const { examId } = req.body;

    const exist = await answerModel.findOne({ examId });

    if (!exist) {
      const answersheet = await new answerModel({
        examId,
      }).save();
    }

    res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};

const uploadExamController = async (req, res) => {
  try {
    const { examId, questions, answer } = req.body;

    const isExist = await answerModel.find({ examId });

    if (!isExist) {
      const answersheet = await new answerModel({
        examId,
      }).save();
    }

    const answers = await answerModel.find({ examId });

    const id = answers[0]._id;

    // Check if the question already exists in the answer array
    const isExistedQuestion = await answerModel.findOne({
      examId,
      answer: { $elemMatch: { questions } }, // Find if this question exists
    });

    if (isExistedQuestion) {
      const doneanswer = await answerModel.findOneAndUpdate(
        { _id: id, "answer.questions": questions }, // Match the document and the specific question
        {
          $set: {
            "answer.$.answer": answer, // Update the answer field for the matched question
          },
        },
        { new: true } // Return the updated document
      );

      return res.status(200).send({
        success: true,
        message: "Answer Updated",
      });
    }

    const doneanswer = await answerModel.findByIdAndUpdate(
      id,
      {
        $push: {
          answer: {
            questions,
            answer,
          },
        },
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Answer saved!",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      error: error.message,
      success: false,
    });
  }
};

const getSelectedAnswer = async (req, res) => {
  try {
    const { examId, questions } = req.body;

    // Check if the question already exists in the answer array
    let isExistedQuestion = await answerModel.findOne(
      { examId, answer: { $elemMatch: { questions } } }, // Match examId and the specific question
      { "answer.$": 1 } // Use projection to return only the matching question
    );

    if (isExistedQuestion) {
      isExistedQuestion = isExistedQuestion.answer;
      return res.status(200).send({
        success: true,
        answer: isExistedQuestion,
      });
    }
    res.status(200).send({
      success: false,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      error,
      success: false,
      message: "Error while getting answer",
    });
  }
};

module.exports = {
  startAnswerController,
  uploadExamController,
  getSelectedAnswer,
};
