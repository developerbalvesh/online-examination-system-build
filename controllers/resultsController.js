const answerModel = require("../models/answerModel");
const questionModel = require("../models/questionModel");
const startExamModel = require("../models/startExamModel");
const resultModel = require("../models/resultModel");

const generateResultController = async (req, res) => {
  try {
    const { id } = req.params;
    const exams = await startExamModel.find({ subjects: id });
    //   .populate("users")
    //   .populate("subjects");

    //   result:{
    //     users,
    //     subjects,
    //     exams,
    //     selections:{
    //         questions,
    //         answers,
    //         correct
    //     }
    //     total,
    //     obtained,
    //     percentage
    //     result
    //   }

    exams.forEach(async (e) => {
      if (e?.completed) {
        const userId = e?.users;
        const subjectId = e?.subjects;
        const examId = e?._id;
        let total = 0;
        let obtained = 0;
        let percentage = 0;
        let result = false;

        await startExamModel.findByIdAndUpdate(examId, { resultStatus: true });

        // check if result is already generated
        const isDone = await resultModel.find({ exams: e._id });

        if (isDone[0]) {
          return;
        }

        const answers = await answerModel.find({ examId: e._id });

        let selections = await Promise.all(
          answers.map(async (a) => {
            const ans = a.answer;
            let ansId = a._id; // answer ID

            const check = await Promise.all(
              ans.map(async (a) => {
                total = total + 1;
                const queId = a.questions; // question ID

                let correct = false;

                // Fetch the question object from the DB
                const question = await questionModel.findById(queId);

                // Determine if the answer is correct
                if (a.answer === question.answer) {
                  correct = true;
                  obtained = obtained + 1; // Update score, if applicable
                }

                // Create the selection object based on your schema
                const selectionObject = {
                  questions: queId, // Question ID
                  answers: ansId, // Answer ID
                  correct, // true or false based on comparison
                };

                return selectionObject; // Return the constructed object
              })
            );

            return check; // Return the array of selection objects for each 'answers'
          })
        );

        selections = selections.flat();
        percentage = (obtained / total) * 100;
        if (percentage >= 40) {
          result = true;
        }

        const resultObject = {
          users: userId,
          subjects: subjectId,
          exams: examId,
          selections,
          total,
          obtained,
          percentage,
          result,
        };

        await new resultModel(resultObject).save();
      }
    });

    res.status(200).send({
      success: true,
      message: "Result generated!",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      error: error.message,
      success: false,
    });
  }
};

const getResultController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await resultModel
      .findOne({ exams: id })
      .populate("users")
      .populate("subjects")
      .populate("exams")
      .populate({
        path: "selections.questions",
        model: "Questions", // Ensure the correct model name
      })
      .populate({
        path: "selections.answers",
        model: "Answers", // Ensure the correct model name
      });
    //   .populate("selections.answers");
    if (!result) {
      res.status(200).send({
        success: false,
        message: "No results found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Fetched successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Server Error",
    });
  }
};

module.exports = { generateResultController, getResultController };
