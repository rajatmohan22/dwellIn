////Following the MVC Architecture
const Cloudinary = require('cloudinary').v2;
const { cloudinary } = require('../cloudinary');
const camp = require('../models/camp');
const review = require('../models/reviews');
const user = require('../models/user');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeoCoding({accessToken: process.env.MAPBOX_TOKEN})

module.exports.index = async(req,res)=>{
    const data = await camp.find({});
    res.render('camps/index',{data:data});
}

module.exports.createCamp = async(req,res,next)=>{ /// here ensureLogin should come before validateCamp or it will allow the creation of a valid campground and then make sure you log in.
    ///THIS CAN BE deleteOne, BUT IF WE HAVE TOO MANY FORM FIELDS, IT WONT SCALE WELL  ///if(!req.body.camp||!req.body.camp.name||!req.body.camp.location||!req.body.camp.price||!req.body.desc){ throw new expressError(500,"Creds are missing")
    const geoData = await geocoder.forwardGeocode({
        query: req.body.camp.location,
        limit: 1 //
      }).send()
    
    req.body.camp.author = req.user._id;
    const newCamp = new camp(req.body.camp);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map((f)=>({
        url: f.path,
        filename: f.filename
    }))
    const nc = await newCamp.save();
    req.flash('success','Done!');
    res.redirect('/camps/'+newCamp._id);  
}

module.exports.createForm = (req,res)=>{ //// get the form to create a new camp.
    res.render('camps/new');
}

module.exports.getCamp = async(req,res)=>{
    const {id} = req.params
    const foundCamp = await camp.findById(req.params.id).populate({
        path: 'review',
        populate:{
            path: 'author'
        }
    }).populate('author')
    if(!foundCamp){
        req.flash('error','Camp not Found Buddy :(');
        return res.redirect(`/camps`);
    }
    res.render('camps/show',{foundCamp});
}

module.exports.editCamp = async(req,res)=>{
    const {id} = req.params;
    const update = await camp.findByIdAndUpdate(id,{...req.body.camp}); /// using split operator just so that we make a copy of the original.
    const images =  req.files.map((f)=>({
        url: f.path,
        filename: f.filename
    }))
    update.images.push(...images);
    if(req.body.deleteImgs){
        await update.updateOne({$pull:{images:{filename:{$in:req.body.deleteImgs}}}});
        // for(let filename in req.body.deleteImgs){
        //     const dele = await cloudinary.uploader.destroy(filename);
        //     console.log(dele);
        //     console.log('Deleted File');
        // }
        req.body.deleteImgs.forEach(async(filename)=>{
            await cloudinary.uploader.destroy(filename)
        })
    }
    
    await update.save();
    req.flash('success','Edit Successful :)');
    return res.redirect(`/camps/${id}`)
}

module.exports.deleteCamp =  async(req,res)=>{

    const {id} = req.params;
    await camp.findByIdAndDelete(id);
    req.flash('success','Camp Deleted :(');
    return res.redirect('/camps');
}

module.exports.editCampForm = async(req,res)=>{ ///// TO render the edit form.
    const {id} = req.params;
    const foundCamp = await camp.findById(req.params.id);
    if(!foundCamp){
        req.flash('error',"How can you edit a camp which isn't there ?");
        return res.redirect('/camps');
    }
    if(req.user._id.equals(foundCamp.author)) res.render('camps/edit',{foundCamp});
    else{
        req.flash('error','Are you crazy? You cannot do that')
        res.redirect(`/camps/${id}`);
    }
}

module.exports.postReview = async(req,res)=>{
    req.body.review.author = req.user._id;
    const Camp = await camp.findById(req.params.id);
    const Review = new review(req.body.review);
    Camp.review.push(Review);
    Camp.save();
    Review.save();
    req.flash('success','Review Added! :)')
    res.redirect(`/camps/${Camp._id}`)
}

module.exports.deleteReview = async(req,res)=>{ /// You cannot add the isAuthor middleware here.
    const {campId,reviewId} = req.params;
    await camp.findByIdAndUpdate(campId,{$pull:{reviews:reviewId}}); /// first parameter is the id ( as specified in findBy"Id"AndUpdate, later in the second argument we are saying, pull from the review arrays all the instances of reviewId).
    await review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted :(');
    res.redirect(`/camps/${campId}`)
}