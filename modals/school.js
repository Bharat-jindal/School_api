const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const schoolSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    streat:{
        type:String,
        required:true
    },
    town:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    schoolcode:{
        type:String,
        required:true
    },    
});

schoolSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('School',schoolSchema);