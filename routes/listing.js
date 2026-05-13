const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const { validateListings } = require("../middlewares/validateListings")
// const listingsModel = require("../models/listing")
const { isLoggedIn } = require("../middlewares/isLoggedIn")
const { isOwner } = require("../middlewares/isOwner")
const { index, getNewListings, getShowRoute, renderCreateRoute, getEditRoute, putEditRoute, deleteRoute } = require("../controllers/listingsController")
const multer = require('multer')
const {storage}=require("../cloudConfig")
const upload = multer({ storage })


//Index Route
router.get("/", wrapAsync(index))


//New Route
router.get("/new", isLoggedIn, wrapAsync(getNewListings))


//Show Route
router.get("/:id", wrapAsync(getShowRoute))


//Create Route
router.post("/create", isLoggedIn, upload.single("image"),validateListings, wrapAsync(renderCreateRoute))


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(getEditRoute))


// Edit Put Route
router.put("/:id", isOwner, isLoggedIn,upload.single("image"), wrapAsync(putEditRoute));


//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteRoute))

module.exports = router