const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/dbConnection');
const initializePassport = require('./config/passport-setup');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middleware/authenticateMiddleware');
const itemRoutes = require('./routes/itemRoutes');
const cors = require('cors');
const router = require('./routes/itemRoutes');
const infoRoutes = require('./routes/infoRoutes');

require('dotenv').config();
connectDB();

const app = express();


initializePassport(
    passport,
    email => User.findOne({email}),
    id => User.findById(id)
);
app.use(express.json());

app.use(cors({
    origin:'https://192.168.1.71:3000',
    credentials:true,
    exposedHeaders:['Authorization']
}));
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
app.use('/item', requireAuth, itemRoutes);
app.use('/info', requireAuth, infoRoutes);
app.get('/protected', requireAuth, (req, res) => {
    res.send('Access to protected resource granted!');
});

const PORT = process.env.PORT || 3500;
const SSL_CERT_PATH = './config/ssl/myserver.crt';
const SSL_KEY_PATH = './config/ssl/myserver.key';

https.createServer({
    key: fs.readFileSync(path.resolve(__dirname, SSL_KEY_PATH)),
    cert: fs.readFileSync(path.resolve(__dirname, SSL_CERT_PATH)),
}, app)
.listen(PORT, function () {
    console.log('Server is running on https://localhost:3500');
});