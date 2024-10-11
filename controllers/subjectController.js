const questionModel = require("../models/questionModel");
const subjectModel = require("../models/subjectModel");

const createSubjectController = async (req, res) => {
  try {
    const { name, time } = req.body;

    if (!name || !time) {
      return res.status(200).send({
        success: false,
        message: "No empty field allowed !",
      });
    }

    const exists = await subjectModel.findOne({ name });

    if (exists) {
      return res.status(200).send({
        success: false,
        message: "Already exists!",
      });
    }

    const subject = await new subjectModel({
      name,
      time,
    }).save();

    res.status(200).send({
      success: true,
      message: "Added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Internal server error",
    });
  }
};

const allSubjectController = async (req, res) => {
  try {
    const subjects = await subjectModel.find({}).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Fetched",
      subjects,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      messge: "Internal error",
    });
  }
};

const deleteSubjectController = async (req, res) => {
  try {
    const id = req.params.id;

    const subject = await subjectModel.findByIdAndDelete({ _id: id });

    res.status(200).send({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Internal error",
    });
  }
};

const getSingleSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const length = (await questionModel.find({ examId: id })).length;
    let subject = {};
    subject = await subjectModel.findById(id);

    subject = { ...subject._doc, length };
    res.status(200).send({
      success: true,
      subject,
      length,
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

const getSingleSubjectDetails=async(req, res)=>{
  try {
    const {id} = req.params;

    const subject = await subjectModel.findById(id);
    res.status(200).send({
      subject,
      success:true
    })
  } catch (error) {
    res.status(500).send({error, success:false})
  }
}

const getSubjectName=async(req, res)=>{
  try {
    const {id} = req.params;

    let name = await subjectModel.findById({_id:id})

    name = name.name;
    res.status(200).send({
      name,
      success:true
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      error
    })
  }
}

module.exports = {
  createSubjectController,
  allSubjectController,
  getSingleSubject,
  deleteSubjectController,
  getSingleSubjectDetails,
  getSubjectName,
};
