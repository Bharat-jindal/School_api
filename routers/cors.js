const express=require('express');
const cors=require('cors');

const app=express();

const whitelist=['http://localhost:3000'];

const corsOptionsDelegate=(req,callback)=>{
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin'))!==-1){
        callback(null,true)
    }
    else{
         callback(new Error('Not Allowed by cors'))
    }
}

exports.cors=cors();
exports.corsWithOptions=cors(corsOptionsDelegate)