const express = require("express");
const { getLoginC, postLoginC, handlelogoutC, getRegisterC, postRegisterC, getForgotC, postForgotC, getResetC, postResetC} = require("../controllers/authController");

const authRoute = express.Router()


authRoute.get("/login",getLoginC)
authRoute.post("/login",postLoginC)

authRoute.get("/register",getRegisterC)
authRoute.post("/register",postRegisterC)

authRoute.get("/forgot",getForgotC)
authRoute.post("/forgot",postForgotC)

authRoute.get("/reset-password",getResetC)
authRoute.post("/reset-password",postResetC)

authRoute.post("/logout",handlelogoutC)



exports.authRoute=authRoute;