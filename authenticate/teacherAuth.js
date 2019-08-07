const passport=require('passport');
const LocalStreategy=require('passport-local').Strategy;

const Teacher=require('../modals/teachers');
const JwtStreategy=require('passport-jwt').Strategy;
const extractJWT=require('passport-jwt').ExtractJwt;
const jwt=require('jsonwebtoken');

const config= require('../config');

exports.local=passport.use('local.teacher',(new LocalStreategy(Teacher.authenticate())));

exports.getToken=(user)=>{
    console.log(user)
    return jwt.sign(user,config["secret-key-teacher"],
    {expiresIn:36000})
}

var opts={};

opts.jwtFromRequest=extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config["secret-key-teacher"];

exports.jwtPassport=passport.use('jwt.teach',new JwtStreategy(opts,
    (jwt_payload,done) => {
        Teacher.findOne({_id:jwt_payload._id},(err,user)=>{
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

    exports.verifyTeacher=passport.authenticate('jwt.teach',{session:false});

    exports.verifyAdmin=()=>{
        return (req,res,next)=>{
            if(req.user.admin===true){
                next();
            }
            else{
                res.status(403).send('You are not authorized to do this Operation')
            }
        }
    }