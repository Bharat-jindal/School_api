const express=require('express');
const http=require('http');
const bodyParser= require('body-parser');
const passport=require('passport');
const config=require('./config');
const cors=require('./routers/cors')

const schoolAuthRouter=require('./routers/schoolAuthRouter');
const studentAuthRouter =require('./routers/studentRouter');
const teacherRouter = require('./routers/teacherRouter');
const taskRouter=require('./routers/taskRouter');
const feeRouter=require('./routers/feesRouter');
const bookRouter=require('./routers/bookRouter')

const mongoose=require('mongoose');
mongoose.Promise=require('bluebird');

const connect=mongoose.connect(config.mongoUrl,{useFindAndModify:false,useNewUrlParser:true});
console.log(config.mongoUrl);
connect.then(()=>{
    console.log('Connected correctly to the servver');
})
.catch(err=>console.log(err))

const app=express();
app.use(bodyParser.json())

const port=process.env.PORT||2000;
const hostname='localhost';


app.use(passport.initialize());
app.use('*', cors.cors);
app.use('/school',schoolAuthRouter);
app.use('/student',studentAuthRouter);
app.use('/teacher',teacherRouter);
app.use('/tasks',taskRouter);
app.use('/fees',feeRouter);
app.use('/books',bookRouter);

app.use((req,res,next)=>{
    res.statusCode=400;
    res.setHeader('Content-Type','applocation/json');
    res.end()
})

const server=http.createServer(app)

server.listen(port,()=>{
    console.log('Server  started on port',port);
})