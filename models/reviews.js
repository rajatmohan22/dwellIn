const mongoose = require('mongoose');
const {Schema} = mongoose;
const {model} = mongoose;


const reviewSchema = new Schema({
    rating: Number,
    body: String,
    author:{
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

module.exports = new model('Review',reviewSchema);