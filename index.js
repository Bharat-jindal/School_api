const express=require('express');
const http=require('http');
const bodyParser= require('body-parser');
const passport=require('passport');
const config=require('./config');

const schoolAuthRouter=require('./routers/schoolAuthRouter');
const studentAuthRouter =require('./routers/studentRouter');
const teacherRouter = require('./routers/teacherRouter');
const taskRouter=require('./routers/taskRouter');
const feeRouter=require('./routers/feesRouter');
const bookRouter=require('./routers/bookRouter')

const mongoose=require('mongoose');
mongoose.Promise=require('bluebird');

const connect=mongoose.connect(config.mongoUrl,{useFindAndModify:false,useNewUrlParser:true});

connect.then(()=>{
    console.log('Connected correctly to the servver');
})
.catch(err=>console.log(err))

const app=express();
app.use(bodyParser.json())

const port=2000;
const hostname='localhost';

app.use(passport.initialize());

app.use('/school',schoolAuthRouter);
app.use('/students',studentAuthRouter);
app.use('/teachers',teacherRouter);
app.use('/tasks',taskRouter);
app.use('/fees',feeRouter);
app.use('/library',bookRouter);

app.use((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>Index html</h1><p>You are in index from js</p></body></html>')
})

const server=http.createServer(app)

server.listen(port,hostname,()=>{
    console.log('Server  started on port',port);
})