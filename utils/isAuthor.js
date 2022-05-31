const camp = require('../models/camp');

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const foundCamp = await camp.findById(id);
    if(foundCamp){
        if(!req.user._id.equals(foundCamp.author)){
            req.flash('error','Are you crazy? You CANNOT do that');
            return res.redirect(`/camps/${id}`);
        }
        next();
    }
    req.flash('Camp Not found, Sorry :(');
    
}