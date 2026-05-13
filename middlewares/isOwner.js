const listingsModel=require("../models/listing")
const isOwner = async (req, res, next) => {
    let { id } = req.params;

    let listing = await listingsModel.findById(id);

    if (!listing.owner.equals(req.user._id)) {
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports={isOwner}