const express=require('express');
const bodyParser=require('body-parser');
const Student=require('../modals/student');
const teacherAuth=require('../authenticate/teacherAuth')
const cors=require('./cors');

var feeRouter=express.Router();
feeRouter.use(bodyParser.json());

feeRouter.route('/')
.get(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
        Student.find({class:req.body.class,schoolcode:req.user.schoolcode})
        .select('fees')
        .then(students=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(students)
        },err=>{next(err)})
        .catch(err=>next(err))
    
})
.post(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.updateMany({class:req.body.class,schoolcode:req.user.schoolcode},
        {$push:{fees:req.body.fee}},{new:true})
        .then(students=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(students)
        },err=>{next(err)})
        .catch(err=>next(err))
})
.put(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.updateMany({class:req.body.class,schoolcode:req.user.schoolcode,'fees.month':req.body.fee.month},
    {$set:{'fees.$.month':req.body.fee.month,'fees.$.amount':req.body.fee.amount}},{new:true})
    .select('fees')
        .then(students=>{
            
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(students)
        },err=>{next(err)})
        .catch(err=>next(err))
})
.delete(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.updateMany({class:req.body.class,schoolcode:req.user.schoolcode}
        ,{$set:{fees:[]}},{new:true})
    .then(students=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(students)
    },err=>{next(err)})
    .catch(err=>next(err))
});

feeRouter.route('/:studId')
.get(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.findById(req.params.studId)
    .select('fees')
    .then(student=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(student)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.put(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.updateOne({_id:req.params.studId,schoolcode:req.user.schoolcode,'fees.month':req.body.fee.month},
    {$set:{'fees.$.paid':req.body.fee.paid}},{new:true})
    .select('fees')
        .then(students=>{
            
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(students)
        },err=>{next(err)})
        .catch(err=>next(err))
})
.delete(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.updateOne({class:req.body.class,schoolcode:req.user.schoolcode,'fees.month':req.body.fee.month},
    {$pull:{'fees':{month:req.body.fee.month}}},{new:true})
    .select('fees')
        .then(students=>{
            
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(students)
        },err=>{next(err)})
        .catch(err=>next(err))
})

module.exports=feeRouter