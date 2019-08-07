const passport=require('passport');
const LocalStreategy=require('passport-local').Strategy;

const School=require('../modals/school');
const JwtStreategy=require('passport-jwt').Strategy;
const extractJWT=require('passport-jwt').ExtractJwt;
const jwt=require('jsonwebtoken');

const config= require('../config');

exports.local=passport.use('local.school',(new LocalStreategy(School.authenticate())));

exports.getToken=(user)=>{
    return jwt.sign(user,config["secret-key-school"],
    {expiresIn:36000})
}

var opts={};

opts.jwtFromRequest=extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config["secret-key-school"];

exports.jwtPassport=passport.use('jwt.school',new JwtStreategy(opts,
    (jwt_payload,done) => {

        School.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false)
            }
            else if(user){
                return done(null,user)
            }
            else{
                return done(null,false)
            }
        })
    }));

    exports.verifySchool=passport.authenticate('jwt.school',{session:false});
    