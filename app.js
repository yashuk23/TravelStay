const express = require("express")
const app = express()
const mongoose = require("mongoose")
const port = process.env.PORT || 8080
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
require("dotenv").config()
const cookieParser=require("cookie-parser")

const listingRoute=require("./routes/listing")
const reviewRoute=require("./routes/review")
const userRouter=require("./routes/user")
const { setUser } = require("./middlewares/auth");

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser())
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))
app.use(setUser);

let cachedDbConnection = null
let cachedDbPromise = null

async function connectDB() {
    if (cachedDbConnection || mongoose.connection.readyState === 1) {
        return mongoose.connection
    }

    if (!cachedDbPromise) {
        cachedDbPromise = mongoose.connect(process.env.MONGO_URl).then((connection) => {
            cachedDbConnection = connection
            return connection
        }).catch((error) => {
            cachedDbPromise = null
            throw error
        })
    }

    return cachedDbPromise
}

app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (err) {
        next(err)
    }
})

connectDB().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err.message)
})

//Root Route
app.get("/", (req, res) => {
    res.send("I am Root")
})


app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRouter)

if (require.main === module) {
    app.listen(port, () => {
        console.log("Server Started")
    })
}

module.exports = app
