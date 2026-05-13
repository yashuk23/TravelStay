const listingsModel = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await listingsModel.find({})
    return res.render("listings/index.ejs", { allListings })
}

module.exports.getNewListings = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.getShowRoute = async (req, res) => {
    let { id } = req.params
    let listing = await listingsModel.findById(id).populate("reviews").populate("owner").populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
    res.render("listings/show.ejs", { listing })
}

module.exports.renderCreateRoute = async (req, res) => {
    const newListing = new listingsModel(req.body.listing);
    // console.log("BODY:", req.body);
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    newListing.owner = req.user._id;

    await newListing.save();

    // req.flash("success", "New Listing Created!");
    res.redirect("/listings");

}

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
  
// })

module.exports.getEditRoute = async (req, res) => {
    let { id } = req.params
    let listing = await listingsModel.findById(id)
    res.render("listings/edit.ejs", { listing })
}

module.exports.putEditRoute = async (req, res) => {
    let { id } = req.params;

    let listing = await listingsModel.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { returnDocument: "after", runValidators: true }
    );

    if (!listing) {
        return res.redirect("/listings");
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    res.redirect(`/listings/${id}`);
}

module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params
    let deletedListing = await listingsModel.findByIdAndDelete(id)
    res.redirect("/listings")
    console.log(deletedListing)
}