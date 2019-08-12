const express=require('express');
const bodyParser=require('body-parser');
const Student=require('../modals/student');
const passport=require('passport');
const authenticate=require('../authenticate/studentAuth')
const cors=require('./cors');

const teacherAuth =require('../authenticate/teacherAuth');

var router=express.Router();
router.use(bodyParser.json());

router.post('/get',cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.find({schoolcode:req.user.schoolcode,class:req.body.class})
    .then(Students=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(Students)
    },err=>{next(err)})
    .catch(err=>next(err))
});

router.post('/signup',cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.register(new Student({username:(req.user.schoolcode+req.body.class+req.body.rollno),
                                name:req.body.name,
                                streat:req.body.streat,
                                town:req.body.town,
                                district:req.body.district,
                                state:req.body.state,
                                schoolname:req.user._id,
                                fathername:req.body.fathername,
                                mothername:req.body.mothername,
                                class:req.body.class,
                                rollno:req.body.rollno,
                                schoolcode:req.user.schoolcode}),
    req.body.password,(err,Student)=>{
        if(err){
            res.statusCode=500;
            res.setHeader('Content-Type','application/json');
            res.json({Error:err})
        }
        else{

            Student.save((err,student)=>{
                if(err){
                    res.statusCode=500;
                    res.setHeader('Content-Type','application/json');
                    res.json({Error:err});
                    return                    
                }
                req.body.username=req.user.schoolcode+req.body.class+req.body.rollno;
                passport.authenticate('local.student')(req,res,()=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    student.hash=undefined;
                    student.salt=undefined;
                    student.fees=undefined;
                    student.books=undefined
                    res.json({success:true,status:'Authenticated',student})
                })                
            })
            
            
        }
    })
})

router.post('/login',cors.corsWithOptions,passport.authenticate('local.student',{session:false}),(req,res,next)=>{
    const Token=authenticate.getToken({_id:req.user._id});
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    req.user.salt=undefined;
    req.user.hash=undefined;
    req.user.fees=undefined;
    req.user.books=undefined
    res.json({token:Token,user:req.user})
});

router.get('/me',cors.corsWithOptions,authenticate.verifyStudent,(req,res,next)=>{
    Student.findById(req.user._id)
    .select('-schoolcode -books')
    .then(student=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(student)
    },err=>next(err))
    .catch(err=>next(err))
})

router.get('/books',cors.corsWithOptions,authenticate.verifyStudent,(req,res,next)=>{
    Student.findById(req.user._id)
    .select('books')
    .populate('books')
    .then(student=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(student)
    },err=>next(err))
    .catch(err=>next(err))
});

router.post('/changePassword',cors.corsWithOptions,authenticate.verifyStudent,(req,res,next)=>{
    Student.findById(req.user._id)
    .then(student=>{
        student.changePassword(req.body.oldPassword,req.body.newPassword,(err,student)=>{
            if(err){
                return next(err)
            }
            student.save()
            .then(user=>{
                res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({status:'Password Changed'})
            })
            .catch(err=>next(err))
        })
    })
    .catch(err=>next(err))
});

router.post('/setPassword/:studId',cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.findOne({_id:req.params.studId,schoolcode:req.user.schoolcode})
    .then(student=>{
                student.setPassword(req.body.newPassword)
                .then(newstudent=>{
                    newstudent.save()
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

router.put('/',cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.findByIdAndUpdate(req.body._id
        ,{$set:{
                    name:req.body.name,
                    streat:req.body.streat,
                    town:req.body.town,
                    district:req.body.district,
                    state:req.body.state,
                    fathername:req.body.fathername,
                    mothername:req.body.mothername
                }},{new:true})
            .then(user=>{
                res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(user)
            })
            .catch(err=>next(err))
});

router.delete('/:studentId',cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.findOneAndDelete({_id:req.params.studentId,schoolcode:req.user.schoolcode})
    .then(resp=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({resp})
            })
    .catch(err=>next(err))
});


module.exports=router