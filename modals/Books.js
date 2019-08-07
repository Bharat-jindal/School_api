const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bookSchema=new Schema({
       title:{
           type:String,
           required:true
       },
       subject:{
        type:String,
        ref:'Teacher',
        required:true
       },
       schoolcode:{
           type:String,
           required:true
       },
       available:{
           type:Boolean,
           default:true
       },
       student:{
           type:String,
           default:''
       }
});


module.exports=mongoose.model('Books',bookSchema);