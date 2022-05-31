const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const camp = require('../models/camp');
const expressError = require('../utils/expressError');
const {validateCamp,validateReview} = require('../utils/schemas/vaidateCamp');


router.route('/')
.post(validateReview,wrapAsync(async(req,res)=>{
    const Camp = await camp.findById(req.params.campId);
    const Review = new review(req.body.review);
    Camp.review.push(Review);
    Camp.save();
    Review.save();
    res.redirect(`/camps/${Camp._id}`)
}))

router.route('/:reviewId')
.delete(wrapAsync(async(req,res)=>{
    const {campId,reviewId} = req.params;
    await camp.findByIdAndUpdate(campId,{$pull:{reviews:reviewId}}); /// first parameter is the id ( as specified in findBy"Id"AndUpdate, later in the second argument we are saying, pull from the review arrays all the instances of reviewId).
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/camps/${campId}`)
}))

module.exports = router;

