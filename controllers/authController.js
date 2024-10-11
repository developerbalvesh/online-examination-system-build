const { hashPassword, comparePassword } = require("../helpers/authHelpers");
const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const registerUserController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    let existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email is already registered",
      });
    }

    existingUser = await userModel.findOne({ phone });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Phone is already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    // save to db
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    }).save();

    res.status(200).send({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
      success: false,
      message: "Error while registering",
    });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Logged In",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
      success: false,
      message: "Error while logging in",
    });
  }
};

const udpateProfileController = async (req, res) => {
  try {
    const { name, address, password } = req.body;

    let obj = {};
    if (password) {
      const hashedPassword = await hashPassword(password);
      obj = { name, address, password: hashedPassword };
    } else {
      obj = { name, address };
    }

    const user = await userModel.findByIdAndUpdate(req.user._id, obj);

    res.status(200).send({
      success: true,
      user,
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).send({
      error,
      success: false,
      message: "error",
    });
  }
};
module.exports = {
  registerUserController,
  loginUserController,
  udpateProfileController,
};
