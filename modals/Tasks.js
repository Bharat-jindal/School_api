const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const contentSchema=new Schema({
    content:{
        type:String,
        required:true
    }
})

const taskSchema=new Schema({
       title:{
           type:String,
           required:true
       },
       teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Teacher',
        required:true
       },
       schoolcode:{
           type:String,
           required:true
       },
       class:{
           type:Array,
           default:[]
       },
       contents:[contentSchema]
},{
    timestamps:true
});


module.exports=mongoose.model('Tasks',taskSchema);