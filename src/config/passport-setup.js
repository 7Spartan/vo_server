const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const passport = require('passport');

const initialize = (passport, getUserByEmail,getUserById)=>{
    const authenticateUser = async(email,password,done)=>{
        const user = getUserByEmail(email);
        if(user ==null){
            return done(null,false, {message:`No user with that email`});
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null,user);
            }else{
                return done(null,false,{message:`Password incorrect`});
            }
        }catch(e){
            return done(e);
        }
    };

    //LocalStrategy
    passport.use(new LocalStrategy({usernameField:`email`},authenticateUser));

    //JWT strategy
    passport.use(new JwtStrategy({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },(jwt_payload,done)=>{
        const user = getUserById(jwt_payload.sub);
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    }));

    passport.serializeUser((user,done) => done(null,user.id));
    passport.deserializeUser((id,done)=>{
        return done(null,getUserById(id));
    });
};

module.exports = initialize;