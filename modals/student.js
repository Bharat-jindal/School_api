const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const FeeSchema=new Schema({
    month:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    paid:{
        type:Boolean,
        default:false
    }
});

const schoolSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    rollno:{
        type:Number,
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
    fathername:{
        type:String,
        required:true
    },
    mothername:{
        type:String,
        required:true
    },
    class:{
        type:Number,
        required:true
    },
    schoolcode:{
        type:String,
        required:true
    },
    fees:[FeeSchema],
    books:[{type:mongoose.Schema.Types.ObjectId,ref:'Books'}]
});

schoolSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('Student',schoolSchema);