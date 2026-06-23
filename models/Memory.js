const mongoose = require("mongoose");


const memorySchema = new mongoose.Schema({

userId:{
type:String,
required:true
},


event:{
type:String,
default:""
},


guests:{
type:String,
default:""
},


budget:{
type:String,
default:""
},


location:{
type:String,
default:""
}


},
{
timestamps:true
});


module.exports =
mongoose.model(
"Memory",
memorySchema
);