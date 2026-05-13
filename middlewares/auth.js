
const jwt = require("jsonwebtoken")

function setUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        res.locals.currUser = null;
        return next();
    }

    try {
        const data = jwt.verify(
            token,
            process.env.JWT_SECRET || "secretkey123"
        );

        req.user = {
            _id: data.id
        };

        res.locals.currUser = req.user;

    } catch (err) {
        req.user = null;
        res.locals.currUser = null;
    }

    next();
}

module.exports = { setUser }