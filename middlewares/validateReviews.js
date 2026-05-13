const {reviewSchema}=require("../utils/schemaValidation")

module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};