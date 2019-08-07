const express=require('express');
const bodyParser=require('body-parser');
const Teacher=require('../modals/teachers');
const passport=require('passport');
const authenticate=require('../authenticate/teacherAuth')
const cors=require('./cors');
const authSchool=require('../authenticate/schoolAuth')

var router=express.Router();
router.use(bodyParser.json());

router.post('/signup',cors.corsWithOptions,authSchool.verifySchool,(req,res,next)=>{
    var admin=false;
    if(req.body.admin){
        admin=req.body.admin
    }
    Teacher.register(new Teacher({username:(req.user.schoolcode+req.body.username),
                                name:req.body.name,
                                streat:req.body.streat,
                                town:req.body.town,
                                district:req.body.district,
                                state:req.body.state,
                                admin:admin,
                                schoolcode:req.user.schoolcode}),
    req.body.password,(err,teacher)=>{
        if(err){
            res.statusCode=500;
            res.setHeader('Content-Type','application/json');
            res.json({Error:err})
        }
        else{

            teacher.save((err,user)=>{
                if(err){
                    res.statusCode=500;
                    res.setHeader('Content-Type','application/json');
                    res.json({Error:err});
                    return                    
                }
                passport.authenticate('local.teacher')(req,res,()=>{
                    req.body.username=req.user.schoolcode+req.body.username;
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:true,status:'Authenticated',teacher})
                })                
            })
            
            
        }
    })
})

router.post('/login',cors.corsWithOptions,passport.authenticate('local.teacher',{session:false}),(req,res,next)=>{
    const Token=authenticate.getToken({_id:req.user._id})
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json({token:Token,user:req.user})
});

router.get('/',authSchool.verifySchool,(req,res,next)=>{
    Teacher.find({schoolcode:req.user.schoolcode})
    .then(teachers=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(teachers)
    },err=>{next(err)})
    .catch(err=>next(err))
});
router.get('/me',cors.corsWithOptions,authenticate.verifyTeacher,(req,res,next)=>{
    Teacher.findById(req.user._id)
    .then(teacher=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(teacher)
    },err=>next(err))
    .catch(err=>next(err))
});

router.post('/changePassword',cors.corsWithOptions,authenticate.verifyTeacher,(req,res,next)=>{
    Teacher.findById(req.user._id)
    .then(teacher=>{
        teacher.changePassword(req.body.oldPassword,req.body.newPassword,(err,teacher)=>{
            if(err){
                return next(err)
            }
            teacher.save()
            .then(()=>{
                res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({status:'Password Changed'})
            })
            .catch(err=>next(err))
        })
    })
    .catch(err=>next(err))
});

router.post('/setPassword/:teacherId',cors.corsWithOptions,authSchool.verifySchool,(req,res,next)=>{
    Teacher.findOne({_id:req.params.teacherId,schoolcode:req.user.schoolcode})
    .then(teacher=>{
                teacher.setPassword(req.body.newPassword)
                .then(newteacher=>{
                    newteacher.save()
                    .then(user=>{
                        res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json({status:'Password set'})
                    })
                    .catch(err=>next(err))
                } )
                .catch(err=>next(err)) 
            
    })
    .catch(err=>next(err))
});


module.exports=router