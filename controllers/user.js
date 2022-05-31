const user = require('../models/user');
const passport = require('passport');
const flash = require('connect-flash/lib/flash');
const {lastVisits} = require('../utils/ensurelogin');

module.exports.registerUser = (req,res)=>{
    res.render('users/register');
}

module.exports.postRegister = async(req,res)=>{
    try{
        const {email,username,password} = req.body;
        const newUser = new user({email,username});
        const auth = await user.register(newUser,password);
        req.login(newUser, function(err) {
            if (err) { return next(err); }
            req.flash('success','Welcome to MediCamp! Glad to have you here');
            res.redirect('/camps');
          });
        
    } catch (e){
        req.flash('error',e.message)
        res.redirect('/register');
    } 
}

module.exports.loginPost = (req,res)=>{
    const returnTo = lastVisits.pop() || '/camps';
    if(lastVisits){
        req.flash('success','Welcome Back!');
        return res.redirect(returnTo);
    }
    req.flash('success','Welcome Back!');
    res.redirect('/camps'); 
}

module.exports.loginPage = (req,res)=>{
    res.render('users/login')
}


module.exports.logout = function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('error','Miss You')
      res.redirect('/login');
    });
  }
