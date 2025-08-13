const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync  = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn} = require("../views/middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

const validateListing = (req,res,next)=>{
     let {error} = listingSchema.validate(req.body);
    if(error){
        let errMSg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMSg);
    }else{
        next();
    }
};



const validateReview = (req,res,next)=>{
     let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMSg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMSg);
    }else{
        next();
    }
};


router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));



// new route
router.get("/new" ,isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn,wrapAsync(listingController.deleteListing));

// //  index route
// router.get("/",wrapAsync(listingController.index));



// //show route
// router.get("/:id",wrapAsync(listingController.showListing));



// // Create route
// router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit", isLoggedIn,wrapAsync(listingController.renderEditForm));

// // update route
// router.put("/:id",isLoggedIn, validateListing, wrapAsync(listingController.updateListing));



// //  delete route
// router.delete("/:id", isLoggedIn,wrapAsync(listingController.deleteListing));

module.exports = router;