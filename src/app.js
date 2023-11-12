const express = require('express');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/dbConnection');
const initializePassport = require('./config/passport-setup');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middleware/authenticateMiddleware');

require('dotenv').config();
connectDB();

const app = express();


initializePassport(
    passport,
    email => User.findOne({email}),
    id => User.findById(id)
);
app.use(express.json());

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth',authRoutes);
app.get('/',(req,res)=> {
    res.send('Hello, Vo!');
});
app.get('/protected', requireAuth, (req, res) => {
    res.send('Access to protected resource granted!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0',()=>{
    console.log(`Server is running on port ${PORT}`);
});