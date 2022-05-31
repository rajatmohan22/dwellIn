const camp = require('../models/camp');
const rev = require('../models/reviews');

module.exports.isReviewAuth = async(req,res,next)=>{
    const {campId,reviewId} = req.params;
    const foundRev = await rev.findById(reviewId);
    if(!foundRev.author.equals(req.user._id)){
        req.flash('error','Are you crazy? You are not authorized to do that')
        return res.redirect(`/camps/${campId}`);
    } 
    next();
}