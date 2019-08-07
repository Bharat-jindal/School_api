const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const passChangeSchema=new Schema({
    uniquepassChange:{
        type:String,
        required:true
    },
    schoolcode:{
        type:String,
        default:''
    }    
});

module.exports=mongoose.model('passChange',passChangeSchema);