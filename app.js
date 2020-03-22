const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// import routes
const authRoute = require('./routes/auth');
const privateRoute = require('./routes/privateRoutes');

dotenv.config();

// connect to DB
mongoose.connect(process.env.DB_CONNECTION,{ useUnifiedTopology: true },()=>console.log('connected to database'));


// bodyParser middleware

app.use(express.json());

// Route middleware
// all auth routes will have the prefix /api/user

app.use('/api/user',authRoute);

// all routes with prefix /api/posts are protected and must pass through privateRoute middleware
app.use('/api/posts',privateRoute);



app.listen(3000, ()=>console.log('Server is running'))