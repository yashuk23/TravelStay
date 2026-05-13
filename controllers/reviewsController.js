const reviewModel = require("../models/review")
const listingsModel = require("../models/listing")

module.exports.createReview = async (req, res) => {
    let { review } = req.body
    let createdReview = await reviewModel.create({
        rating: review.rating,
        comment: review.comment,
        author: req.user.id
    })
    let listing = await listingsModel.findById(req.params.id)
    listing.reviews.push(createdReview)
    await listing.save()
    res.redirect(`/listings/${req.params.id}`);
}


module.exports.deleteReview = async (req, res) => {

    let { id, reviewId } = req.params;

    let review = await reviewModel.findById(reviewId);
    let listing = await listingsModel.findById(id);

    if (!review.author ||
        !review.author.equals(req.user.id) &&
        !listing.owner.equals(req.user.id)
    ) {
        return res.send("Not authorized");
    }

    await reviewModel.findByIdAndDelete(reviewId);

    await listingsModel.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    res.redirect(`/listings/${id}`);
}
