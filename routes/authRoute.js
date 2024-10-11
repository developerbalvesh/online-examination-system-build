const express = require("express");
const { registerUserController, loginUserController, udpateProfileController } = require("../controllers/authController.js");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware.js");

const router = express.Router();

// register user
router.post("/register", registerUserController);

// login user
router.post("/login", loginUserController);

// update profile
router.put("/update-profile", requireSignIn, udpateProfileController)

// user auth
router.get("/user-auth", requireSignIn, (req, res)=>{
    res.status(200).send({ok:true})
})

// is admin
router.get('/isadmin', requireSignIn, isAdmin, (req, res)=>{
    res.status(200).send({
        ok:true
    })
})

router.post("/protected-route",requireSignIn, isAdmin, (req, res)=>{
    res.status(200).send({
        success:true,
        message:"this is protected route"
    })
})

module.exports = router;
