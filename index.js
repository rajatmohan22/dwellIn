require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.static('public'));
const localUrl = 'mongodb://localhost:27017/dwellDB'
const dbURL = process.env.ATLAS_URI
const connectionURL = dbURL || localUrl
mongoose.connect(connectionURL,{ useNewUrlParser: true })
const db = mongoose.connection;
const camp = require('./models/camp');
const review = require('./models/reviews');
const user = require('./models/user');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const dataArray = require('./seeds/seeds');
app.set('view engine','ejs');
const bodyParser = require('body-parser');
const {validateCamp,validateReview} = require('./utils/schemas/vaidateCamp');
const expressError = require('./utils/expressError');
const { findByIdAndDelete, deleteOne } = require('./models/camp');
const wrapAsync = require('./utils/wrapAsync');
const campRoute = require('./routes/camp');
const userRoute = require('./routes/user');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs',ejsMate);
app.use(flash());
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize({replaceWith: '_'}));
const helmet = require("helmet");
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dx1e7lfrf/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


db.once("open",()=>{
    console.log("Database connected.")
})
const session = require('express-session');
const MongoDBStore = require("connect-mongo")(session);
const secret = process.env.SECRET || 'ilovedextermorgan'
const store = new MongoDBStore({
    url: connectionURL,
    secret: secret,
    touchAfter: 24*3600
})
store.on("error",(e)=>{
    console.log("Session Store Error: "+e)
})


const sessionConfig = {
    store,
    name: 'bxd34_1_lq2wer', //// connect.sid will still be there but that is an old one
    secret: 'thisshouldbeabettersecretman',
    resave: false,
    saveUninitialized: true,
    cookie: {
    
        // securure: true,
        httpOnly:true,
        expires: Date.now()+ 60*60*60*24*7,
        maxAge: 60*60*60*24*7 
    } //// if we are using this for authentication purposes and we dont set the expires and maxAge then 
    //// when a person logs in, he will stay logged in forever.
}

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

// app.get('/fakeuser',async(req,res)=>{
//     const fakeuser = new user({email:'rajatmohaaan22@gmail.com',username:'rajatmaaohan'});
//     const auth = await user.register(fakeuser,'dexteaarmorgan'); // if you remove await here, it will return an empty object because the promise wont be fulfilled yet. It should be common sense by now
//     res.send(auth);
// })
app.use('/',userRoute);
app.use('/camps',campRoute); ////flash should be defined after the sessions code remember.

app.route('/')
.get((req,res)=>{
    res.render('home');
})


///Session cookies are cookies that last for a session. A session starts when you 
// launch a website or web app and ends when you leave the website or close your browser window. 
// Session cookies contain information that is stored in a temporary memory location 
// which is deleted after the session ends



app.all('*',(req,res,next)=>{
    next(new expressError(404,"You hit the wrong route buddy"))
})

app.use((err,req,res,next)=>{
    const {status=500,message="Something isn't adding up."} = err;
    res.status(status).render('camps/error',{err});
})

const PORT = process.env.PORT ;
app.listen(PORT,'0.0.0.0' ,() => {
    console.log(`Our app is running on port ${ PORT }`);
});
