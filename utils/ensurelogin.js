const {recentVisit} = require('../utils/recentVisit');
module.exports.ensureLogin = async(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    } else {
        if((req.originalUrl!='/camps'||req.originalUrl!='/login')&&req.originalUrl){ // making sure it doesnt store undefined.
            recentVisit.push(req.originalUrl);
            console.log("recentVisit: "+recentVisit);
            req.flash('error','You Must First Log In');
            res.redirect('/login');
        }  
    }
}
module.exports.lastVisits = recentVisit;
