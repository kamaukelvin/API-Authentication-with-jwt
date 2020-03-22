const router = require('express').Router();
// import the verify function

const verify = require('./verifyToken');

// to make a route private, just add the verify as a middleware to the specific route
router.get('/', verify, (req,res)=>{

    // *******TRIAL POST TO BE FETCHED ONLY WHEN VERIFIED***************
// res.json({
//     posts:{
//         title:'my post',
//         description: 'random data that requires access'
//     }
// })


// we can get a specific user(i.e the id of that user) based on the jwt token of that user
// this gets the id corresponding to the jwt token
res.send(req.user);

});

module.exports = router;