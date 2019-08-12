const express=require('express');
const bodyParser=require('body-parser');
const Student=require('../modals/student');
const teacherAuth=require('../authenticate/teacherAuth')
const cors=require('./cors');
const studentAuth = require('../authenticate/studentAuth')

var feeRouter=express.Router();
feeRouter.use(bodyParser.json());

feeRouter.route('/')
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
    Student.updateMany({class:req.body.class,schoolcode:req.user.schoolcode,'fees.month':req.body.fee.month},
    {$pull:{'fees':{month:req.body.fee.month}}},{new:true})
    .select('fees')
        .then(students=>{
            
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(students)
        },err=>{next(err)})
        .catch(err=>next(err))
})

feeRouter.route('/:studId')
.get(cors.corsWithOptions,studentAuth.verifyStudent,(req,res,next)=>{
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
    Student.findOne({_id:req.params.studId,schoolcode:req.user.schoolcode})
        .then(students=>{
            var feesArray=[]
            for(let i=0;i<feesArray.length;i++){
                if(feesArray[i].month===req.body.month){
                    feesArray[i].paid=req.body.paid
                }
            }
            students.fees=feesArray;
            students.save()
            .then(response=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(students)
            })
            .catch(err=>next(err))
            
        },err=>{next(err)})
        .catch(err=>next(err))
})

feeRouter.route('/get')
.post(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.findOne({class:req.body.class,schoolcode:req.user.schoolcode})
    .select('fees')
    .then(fees=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json({fees})
    },err=>{next(err)})
    .catch(err=>next(err))

})

feeRouter.route('/student')
.post(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Student.findOne({username:req.body.username ,schoolcode:req.user.schoolcode})
    .select('fees')
    .then(student=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(student)
    },err=>{next(err)})
    .catch(err=>next(err))
})

module.exports=feeRouter