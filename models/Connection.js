const mongoose=require("mongoose");

const ConnectionSchema=new mongoose.Schema({
    SenderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    
    },
    ReceiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending",
    },
  

},{ timestamps:true});

module.exports=mongoose.model("Connection",ConnectionSchema);

