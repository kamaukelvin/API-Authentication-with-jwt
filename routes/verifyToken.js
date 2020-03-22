const jwt = require('jsonwebtoken');

// this middleware function just checks that specified route requests made contains the authentication token
// we can add this middleware to any route we wish to protect

module.exports = function (req,res,next){

    // the token is assigned when we login
    const token = req.header('auth-token');

    // if the request does not have an auth token
    if(!token) return res.status(401).send('Access denied')

    // if the token is available
    try{
        // verify the said token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        // after verifying go to the next middleware/command
        next();


    }catch(err){
        res.status(400).send('Invalid Token');

    }
}