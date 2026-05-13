const userModel = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


module.exports.renderSignup = async (req, res) => {
    return res.render("users/signup.ejs")
}

module.exports.createUser = async (req, res) => {
    let { username, email, password } = req.body
    let alreadyExist = await userModel.findOne({ email: email })
    if (alreadyExist) {
        if (alreadyExist) {
            return res.send("User already exists. Try logging in.");
        }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await userModel.create({
        username,
        email,
        password: hash
    });

    return res.redirect("/login");
}

module.exports.renderLogin = async (req, res) => {
    return res.render("users/login.ejs")
}

module.exports.loginUser = async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || !user.password) {
        return res.send("Invalid Email or Password");
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
        return res.send("Invalid Email or Password");
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "secretkey123"
    );

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/listings");
}

module.exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    res.redirect("/listings")
}