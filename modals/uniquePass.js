const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const passSchema=new Schema({
    uniquepass:{
        type:String,
        required:true,
        minlength:15
    }    
});

module.exports=mongoose.model('UniquePass',passSchema);