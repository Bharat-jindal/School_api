const express=require('express');
const cors=require('cors');

const app=express();

var whitelist = ['https://nextsmartschool.firebaseapp.com','https://nextsmartschool.web.app']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } 
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

exports.cors=cors();
exports.corsWithOptions=cors(corsOptionsDelegate)