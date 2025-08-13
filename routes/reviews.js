const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync  = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isReviewAuthor } = require("../views/middleware.js");

const reviewController = require("../controllers/reviews.js");

const validateReview = (req,res,next)=>{
     let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMSg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMSg);
    }else{
        next();
    }
};

// reviews
//post rout
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId", isReviewAuthor,
     isLoggedIn,wrapAsync(reviewController.desttroyReview));

module.exports = router;