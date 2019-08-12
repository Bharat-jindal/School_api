const express=require('express');
const bodyParser=require('body-parser');
const Task=require('../modals/Tasks');
const cors=require('./cors');

const teacherAuth =require('../authenticate/teacherAuth');
const studentAuth=require('../authenticate/studentAuth');

var taskRouter=express.Router();
taskRouter.use(bodyParser.json());

taskRouter.route('/student')
.get(cors.corsWithOptions,studentAuth.verifyStudent,(req,res,next)=>{
    Task.find({schoolcode:req.user.schoolcode,class:req.user.class})
    .populate('teacher','name')
    .select('-schoolcode -class')
    .then(tasks=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(tasks)
    },err=>{next(err)})
    .catch(err=>next(err))
});

taskRouter.route('/teacher')
.get(cors.corsWithOptions,teacherAuth.verifyTeacher,(req,res,next)=>{
    Task.find({teacher:req.user._id})
    .select('-schoolcode -teacher')
    .then(tasks=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(tasks)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.post(cors.corsWithOptions,teacherAuth.verifyTeacher,(req,res,next)=>{
    Task.create({
        title:req.body.title,
        teacher:req.user._id,
        schoolcode:req.user.schoolcode,
        contents:req.body.contents,
        class:req.body.class
    })
    .then(task=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json({task})
    },err=>{next(err)})
    .catch(err=>next(err))
})
.delete(cors.corsWithOptions,teacherAuth.verifyTeacher,(req,res,next)=>{
    Task.deleteMany({teacher:req.user._id,schoolcode:req.user.schoolcode})
    .then(tasks=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(tasks)
    },err=>{next(err)})
    .catch(err=>next(err))
})

taskRouter.route('/teacher/:taskId')
.get(cors.corsWithOptions,teacherAuth.verifyTeacher,(req,res,next)=>{
   
    Task.findById(req.params.taskId)
    .select('-schoolcode -teacher')
    .then(task=>{
        if(task!==null){
            if(task.schoolcode===req.user.schoolcode){
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(task) 
            }
            else{
                var err =new Error(`You are not Authorized for this task`);
            err.status=404;
            return next(err)
            }
        }
        else{
            var err =new Error(`Task not found`);
            err.status=404;
            return next(err) 
        }
    })
})
.put(cors.corsWithOptions,teacherAuth.verifyTeacher,(req,res,next)=>{
    Task.findOneAndUpdate({_id:req.params.taskId,teacher:req.user._id,},{
        $set:{
            title:req.body.title,
            contents:req.body.contents,
            class:req.body.class}
    },{new:true})
    .then(task=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(task)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.delete(cors.corsWithOptions,teacherAuth.verifyTeacher,(req,res,next)=>{
    Task.deleteOne({_id:req.params.taskId,teacher:req.user._id})
    .then(task=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(task)
    },err=>{next(err)})
    .catch(err=>next(err))
});

module.exports=taskRouter;
