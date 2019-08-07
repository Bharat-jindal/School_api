const express=require('express');
const bodyParser=require('body-parser');
const Book=require('../modals/Books');
const Student=require('../modals/student')
const cors=require('./cors');

const teacherAuth =require('../authenticate/teacherAuth');

var bookRouter=express.Router();
bookRouter.use(bodyParser.json());

bookRouter.route('/')
.get(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Book.find({schoolcode:req.user.schoolcode})
    .then(books=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(books)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.post(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Book.create({
        title:req.body.title,
        schoolcode:req.user.schoolcode,
        subject:req.body.subject
    })
    .then(task=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(task)
    },err=>{next(err)})
    .catch(err=>next(err))
})

bookRouter.route('/:bookId')
.get(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
   
    Book.findById(req.params.bookId)
    .then(book=>{
        if(book!==null){
            if(book.schoolcode===req.user.schoolcode){
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(book) 
            }
            else{
                var err =new Error(`Book not found`);
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
.put(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Book.findOneAndUpdate({_id:req.params.bookId,schoolcode:req.user.schoolcode,},{
        $set:{
            title:req.body.title,
            subject:req.body.subject,}
    },{new:true})
    .then(book=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(book)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.delete(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Book.findOne({_id:req.params.bookId,schoolcode:req.user.schoolcode})
    .then(book=>{
        if(book.available===true){
            book.remove()
            .then(book=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(book)
            })
        }
        else{
            var err=new Error('Book not avaiable now')
            err.status=400;
            next(err)
        }
    },err=>{next(err)})
    .catch(err=>next(err))
});

bookRouter.route('/issue/:bookId')
.put(cors.corsWithOptions,teacherAuth.verifyTeacher,teacherAuth.verifyAdmin(),(req,res,next)=>{
    Book.findOneAndUpdate({_id:req.params.bookId,schoolcode:req.user.schoolcode,},{
        $set:{
            available:req.body.available,
            student:req.body.student}
    })
    .then(book=>{
        if(req.body.student!==''){
            Student.findByIdAndUpdate(req.body.student,
                {$push:{books:req.params.bookId}},{new:true})
            .then(student=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(student)
            },err=>{next(err)})
            .catch(err=>next(err))
        }
        else if(req.body.student===''){Student.findByIdAndUpdate(book.student,
            {$pull:{books:req.params.bookId}},{new:true})
        .then(student=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(student)
        },err=>{next(err)})
        .catch(err=>next(err))}
        else{
            var error=new Error('Something went wrong')
            error.status=400;
            next(error)
        }
    },err=>{next(err)})
    .catch(err=>next(err))
})

module.exports=bookRouter;
