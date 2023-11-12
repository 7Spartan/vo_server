const passport = require('passport');

//Middleware to require login/auth
const requireAuth = passport.authenticate('jwt',{session:false});

module.exports=requireAuth;