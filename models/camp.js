const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./reviews');
const {cloudinary} = require('../cloudinary');



const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_200');
  }); /// EXTREMELY SEXY!

  const opts = { toJSON: { virtuals: true } };
const campSchema = new Schema({
    name: String,
    images: [imageSchema],
    location: String,
    price: Number,
    desc: String,

    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },

    review:[{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},opts)

campSchema.post('findOneAndDelete',async(doc)=>{
    await review.deleteMany({
        _id:{
            $in: doc.review
        }
    })

    doc.images.forEach(async(image)=> {
        await cloudinary.uploader.destroy(image.filename);
    });
})

campSchema.virtual('properties.popupText').get(function() { //// pay attention to they way popup Text is actually mested within properties.
    return `<a href="/camps/${this.id}">${this.name}</a>
    <p>${this.desc.substring(0,20)}</p>
    `
  }); /// EXTREMELY SEXY!



module.exports = mongoose.model('Dwellcamp',campSchema);