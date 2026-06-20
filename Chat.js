const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },

    chatId:{
        type:String,
        required:true
    },

    title:{
        type:String,
        default:"New Chat"
    },

    role:{
        type:String,
        required:true
    },

    text:{
        type:String,
        required:true
    }

},{
    timestamps:true
});


module.exports = mongoose.model(
    "Chat",
    chatSchema
);