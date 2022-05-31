// module.exports =wrapAsync = (fun)=>{
//     return function(err,req,res,next){
//         fun(err,req,res,next)
//         .catch((e)=>next(e))
//     }
// }

// This is one way of doing it (synctactically)
// another way to do this is:
module.exports = (fun)=>{
    return (req,res,next)=>{
        fun(req,res,next).catch((e)=>next(e))
    }
}
