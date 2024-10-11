const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
const userModel = require("../models/userModel");

dotenv.config();

// protected routes
const requireSignIn = async (req, res, next) => {
  try {

    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user=decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
      success: false,
      message: "Please Login to continue",
    });
  }
};

// is admin
const isAdmin=async(req, res, next)=>{
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role===0){
            return res.status(200).send({
                success:true,
                message:"Require admin authorization"
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error,
            success:false,
            message:"This action require admin login"
        })
    }
}

module.exports = {requireSignIn, isAdmin}