const { listingSchema } = require("../utils/schemaValidation");

module.exports.validateListings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body.listing);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};