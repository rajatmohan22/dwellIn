const express = require('express');
const app = express();
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const camp = require('../models/camp');
const expressError = require('../utils/expressError');
require('dotenv').config()
const {isAuthor} = require('../utils/isAuthor');
const {validateCamp,validateReview} = require('../utils/schemas/vaidateCamp');
const review = require('../models/reviews');
const flash = require('connect-flash');
const campcontrol = require('../controllers/camp');
const {isReviewAuth} = require('../utils/isReviewAuth')
const {ensureLogin} = require('../utils/ensurelogin');
app.use(flash());
const multer  = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage })


router.route('/')
.get(wrapAsync(campcontrol.index))
.post(ensureLogin,upload.array('image'),validateCamp,wrapAsync(campcontrol.createCamp)) ////ADD VALIDATION
// .post(upload.array('image'),(req,res)=>{
//     res.send("It worked")
//     console.log(req.files)
// })

router.route('/new') /// This should be above camps/:id or else it will treat new as :id. So order matters in cases like these.
.get(ensureLogin,campcontrol.createForm);

router.route('/:id')
.get(wrapAsync(campcontrol.getCamp))
.put(ensureLogin,isAuthor,upload.array('image'),validateCamp,wrapAsync(campcontrol.editCamp)) ///ADD VALIDATION
.delete(ensureLogin,isAuthor,campcontrol.deleteCamp);

router.route('/:id/review')
.post(ensureLogin,validateReview,wrapAsync(campcontrol.postReview));

router.route('/:id/edit')
.get(ensureLogin,wrapAsync(campcontrol.editCampForm))

router.route('/:campId/review/:reviewId')
.delete(ensureLogin,wrapAsync(campcontrol.deleteReview));

module.exports = router;
const uri = ""

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });