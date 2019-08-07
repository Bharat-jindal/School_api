const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const teacherSchema=new Schema({
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
    schoolname:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'School'
    },
    admin:{
        type:Boolean,
        default:false
    },
    schoolcode:{
        type:String,
        required:true
    },
    tests:[{type:mongoose.Schema.Types.ObjectId,ref:'Test'}]    
});

teacherSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('Teacher',teacherSchema);