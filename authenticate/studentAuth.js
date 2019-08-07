const passport=require('passport');
const LocalStreategy=require('passport-local').Strategy;

const Student=require('../modals/student');
const JwtStreategy=require('passport-jwt').Strategy;
const extractJWT=require('passport-jwt').ExtractJwt;
const jwt=require('jsonwebtoken');

const config= require('../config');

exports.local=passport.use('local.student',(new LocalStreategy(Student.authenticate())));

exports.getToken=(user)=>{
    return jwt.sign(user,config["secret-key-user"],
    {expiresIn:36000})
}

var opts={};

opts.jwtFromRequest=extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config["secret-key-user"];

exports.jwtPassport=passport.use('jwt.student',new JwtStreategy(opts,
    (jwt_payload,done) => {

        Student.findOne({_id:jwt_payload._id},(err,user)=>{
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

    exports.verifyStudent=passport.authenticate('jwt.student',{session:false});