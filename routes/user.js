const express = require("express")
const wrapAsync = require("../utils/wrapAsync")
const router = express.Router()
// const userModel = require("../models/user")
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken")

const {renderSignup,renderLogin,createUser,loginUser,logoutUser}=require("../controllers/usersController")

router.get("/signup", wrapAsync(renderSignup))

router.post("/signup", wrapAsync(createUser))

router.get("/login", wrapAsync(renderLogin))

router.post("/login", wrapAsync(loginUser))

router.get("/logout",logoutUser)

module.exports = router