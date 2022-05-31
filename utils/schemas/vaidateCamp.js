const expressError = require('../expressError.js');
const Basejoi = require('joi');
const sanitizeHtml = require('sanitize-html');

///Avoid Cross Side Scripting.
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHtml(value, { //pkg "sanitize-html" 
                    allowedTags:[],  //nothing is allowed - not even h1 or p
                    allowedAttributes:{},
                });
                if (clean !== value) return helpers.error('string.escapeHTML',{ value })//if there's a difference in the sanitized output= error
                return clean;
            }
        }
    }
});

const joi = Basejoi.extend(extension);

module.exports.validateCamp = (req,res,next)=>{

    const mcampschema = joi.object({
        name: 
        joi.string()
        .escapeHTML()
        .min(5)
        .max(30)
        .required(),


        images: 
        joi.string().escapeHTML(),


        location: 
        joi.string()
        .required()
        .escapeHTML(),


        price: 
        joi.number()
        .min(0)
        .max(500)
        .required(),


        desc: 
        joi.string()
        .max(500)
        .escapeHTML()
        .required()

    }).required();
   const result =  mcampschema.validate(req.body.camp);
    //console.log(`Erorr=${result.error}`);
   const {error} = result;
    if(error){
        throw new expressError(500,result.error)
    } else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{

    const valireview = joi.object({
        rating: 
        joi.number()
        .min(1)
        .max(5)
        .required()
        ,
        body: joi.string().required().escapeHTML()
    }).required();

    const Review = valireview.validate(req.body.review);
    const {error} = Review;
    if(error){
        console.log("Eror: "+error);
        throw new expressError(500,error)
    } else {
        next();
    }

}

