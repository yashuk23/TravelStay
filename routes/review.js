const express = require("express")
const router = express.Router({ mergeParams: true })
// const reviewModel = require("../models/review")
// const listingsModel = require("../models/listing")
const { validateReviews } = require("../middlewares/validateReviews")
const wrapAsync = require("../utils/wrapAsync")
const { isLoggedIn } = require("../middlewares/isLoggedIn")
const { isOwner } = require("../middlewares/isOwner")

const {createReview,deleteReview}=require("../controllers/reviewsController")

//Review Post Route
router.post("/", validateReviews, isLoggedIn, wrapAsync(createReview))


//Delete Review Route 
router.delete("/:reviewId",
    isLoggedIn,
    isOwner,
    wrapAsync(deleteReview)
);

module.exports = router