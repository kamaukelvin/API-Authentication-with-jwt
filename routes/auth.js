const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER A USER
router.post('/register',async (req, res)=>{

    // destructure the error property
    const {error} = registerValidation(req.body);

    // if we have an error, return the error with statuscode 400
    if (error) return res.status(400).send(error.details[0].message);

    // check if user already exists to avoid duplicate records
    const emailExists = await User.findOne({email:req.body.email});
    // if email is already registered
    if(emailExists)return res.status(400).send('Email already registered')


    // Hash password to protect them
    // salt combines wit your password to form a 'mumbled' password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)


    // if successful create the user

  const user = new User({
      name: req.body.name,
      email:req.body.email,
      password:hashedPassword
  });
  try{
    //   save to db
    const savedUser = await user.save();
    // res.send('New user created');
    res.send({user: user._id,})

  }catch(err){
      res.status(400).send(err)
  }
});


// 2.LOGIN A USER
router.post('/login',async(req,res)=>{
       // destructure the error property
       const {error} = loginValidation(req.body);

       // if we have an error, return the error with statuscode 400
       if (error) return res.status(400).send(error.details[0].message);

        // check if user already exists by checking the email
    const user = await User.findOne({email:req.body.email});

    // if email is already registered
    if(!user)return res.status(400).send('Email does not exist')

    // checK if password entered matches the one in db
    // we use a bcrypt method called compare, which takes two params==>entered password and password in db
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    // if password is not valid we return a message
    if(!validPassword) return res.status(400).send('Invalid email or password');

    // assign and create a webtoken when everything is successful
    // we use a packeage called jsonwebtoken
    // we use a method called sign which we can pas any data we want==>here am just passing the user id and a token secret(to be stored in .env file)
    const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

    // Adding our token to the headers and return the token on successful login
    res.header('auth-token', token).send({token});


});

module.exports= router;