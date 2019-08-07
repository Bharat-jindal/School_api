const express=require('express');
const bodyParser=require('body-parser');
const School=require('../modals/school');
const UniquePass=require('../modals/uniquePass');
const passport=require('passport');
const authenticate=require('../authenticate/schoolAuth');
const cors=require('./cors');
const PasswordKey=require('../modals/changePassword');

var router=express.Router();
router.use(bodyParser.json());

router.post('/signup',cors.corsWithOptions,(req,res,next)=>{
    UniquePass.findOne({uniquepass:req.body.uniquepass})
    .then(key=>{
        if(key!==null){
School.register(new School({username:req.body.username,
                                name:req.body.name,
                                streat:req.body.streat,
                                town:req.body.town,
                                district:req.body.district,
                                state:req.body.state,
                                schoolcode:req.body.username}),
    req.body.password,(err,school)=>{
        if(err){
            res.statusCode=500;
            res.setHeader('Content-Type','application/json');
            res.json({Error:err})
        }
        else{

            school.save((err,user)=>{
                if(err){
                    res.statusCode=500;
                    res.setHeader('Content-Type','application/json');
                    res.json({Error:err});
                    return                    
                }
                key.remove()
                passport.authenticate('local.school')(req,res,()=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:true,status:'Authenticated',user})
                })                
            })
            
            
        }
    })
        }
        else{
            var err =new Error(`The key you pass does not found`);
            err.status=404;
            return next(err)
        }
    })
    
})

router.post('/login',cors.corsWithOptions,passport.authenticate('local.school',{session:false}),(req,res,next)=>{
    const Token=authenticate.getToken({_id:req.user._id})
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json({token:Token,user:req.user})
});

router.get('/me',cors.corsWithOptions,authenticate.verifySchool,(req,res,next)=>{
    School.findById(req.user._id)
    .then(school=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(school)
    },err=>next(err))
    .catch(err=>next(err))
});

router.post('/changePassword',cors.corsWithOptions,authenticate.verifySchool,(req,res,next)=>{
    School.findById(req.user._id)
    .then(school=>{
        school.changePassword(req.body.oldPassword,req.body.newPassword,(err,school)=>{
            if(err){
                return next(err)
            }
            school.save()
            .then(user=>{
                res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(user)
            })
            .catch(err=>next(err))
        })
    })
    .catch(err=>next(err))
});

router.post('/setPassword',cors.corsWithOptions,(req,res,next)=>{
    School.findOne({schoolcode:req.body.schoolcode})
    .then(school=>{
        PasswordKey.findOne({uniquepassChange:req.body.uniquePassChange,schoolcode:school.schoolcode})
        .then(key=>{
            if(key!==null){
                school.setPassword(req.body.newPassword)
                .then(newschool=>{
                    newschool.save()
                    .then(user=>{
                        key.remove()
                        res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json({status:'Password set'})
                    })
                    .catch(err=>next(err))
                } )
                .catch(err=>next(err)) 
            }
            else{
                var err=new Error('Key not found');
                err.status=401;
                next(err)
            }
        })
    })
    .catch(err=>next(err))
});

module.exports=router