// const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
// const app = express();
mongoose.connect(process.env.ATLAS_URI);
const db = mongoose.connection;
db.once("open",()=>{
    console.log("Database connected.")
});
const camp = require('../models/camp');
const dataArray = require('./seeds');
// app.set('view engine','ejs');

const seedDB = async()=>{
    await camp.deleteMany({}); ///This is a veryyyyyy important step, please understand why.
    console.log('Old data has been deleted');
    dataArray.forEach((element)=>{
        const eleNew = new camp(element);
        eleNew.save();
    })
    console.log("Seeding complete.");
}

seedDB()
.then(()=>{
    mongoose.connection.close;
})

.catch(()=>{
    console.log('unable to close')
})