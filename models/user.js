const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const dwellerSchema = new Schema({
    email:{
        type:String,
        required: true,
        unique: true
    }
})

dwellerSchema.plugin(passportLocalMongoose);
module.exports = new model('User',dwellerSchema);