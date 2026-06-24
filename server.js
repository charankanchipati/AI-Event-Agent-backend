require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { chatWithAI } = require("./aiService");

const authRoutes = require("./routes/auth");

const Chat = require("./Chat");


const app = express();

app.get("/", (req,res)=>{
    res.send("Backend is running");
});

// Middleware

app.use(cors({

origin:"*",

methods:[
"GET",
"POST"
],

allowedHeaders:[
"Content-Type"
]

}));


app.use(express.json());



// Auth

app.use("/api/auth",authRoutes);





// MongoDB


mongoose.connect(

process.env.MONGO_URI,

{
serverSelectionTimeoutMS:30000
}

)

.then(()=>{

console.log("MongoDB Connected");

})

.catch(error=>{


console.log(

"MongoDB Error:",
error.message

);


});


// TEST API


app.get("/api/test",(req,res)=>{


res.json({

message:"Backend API working"

});


});

// =================================
// GET SIDEBAR CHAT LIST
// =================================


app.get(

"/api/chats/:userId",

async(req,res)=>{


try{


const chats = await Chat.find({

userId:req.params.userId

})

.sort({

createdAt:-1

});



const history=[];


const ids=new Set();



chats.forEach(chat=>{


if(!ids.has(chat.chatId)){


history.push({

chatId:chat.chatId,

title:
chat.title || "New Chat"


});


ids.add(chat.chatId);



}


});



res.json(history);



}


catch(error){


console.log(error);


res.status(500).json({

error:"History loading failed"

});


}



});



// =================================
// LOAD OLD CHAT
// =================================


app.get(

"/api/chats/:userId/:chatId",

async(req,res)=>{


try{


const messages = await Chat.find({


userId:req.params.userId,


chatId:req.params.chatId


})

.sort({

createdAt:1

});



res.json(messages);



}


catch(error){


console.log(error);


res.status(500).json({

error:"Cannot load chat"

});


}


});




// =================================
// AI CHAT
// =================================


app.post(

"/api/chat",

async(req,res)=>{


try{


const {

userId,

chatId,

message


}=req.body;




const reply = await chatWithAI(

[],

message,

{},

[],

[]


);






// check old chat


const existingChat = await Chat.findOne({

userId:userId,

chatId:chatId


});






// save user message


const oldChat = await Chat.findOne({

userId:userId,

chatId:chatId

});



await Chat.create({

userId:userId,

chatId:chatId,

title:

oldChat?.title || message.substring(0,40),

role:"user",

text:message

});







// save AI reply


await Chat.create({


userId:userId,


chatId:chatId,


title:

existingChat?.title ||

message.substring(0,40),


role:"assistant",


text:reply



});







res.json({

reply:reply

});





}


catch(error){


console.log(

"Chat API Error",

error

);



res.status(500).json({

error:"AI service failed"

});


}



});











// =================================
// MANUAL SAVE CHAT
// =================================


app.post(

"/api/chats",

async(req,res)=>{


try{


const chat = new Chat(req.body);


await chat.save();



res.json(chat);



}

catch(error){


console.log(error);



res.status(500).json({

error:"Chat save failed"

});


}



});












// SERVER START


const PORT =
process.env.PORT || 5002;



app.listen(

PORT,

"0.0.0.0",

()=>{


console.log(

`Server running on port ${PORT}`

);


}

);
// require("dotenv").config();
// const { chatWithAI } = require("./aiService");

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");


// const authRoutes = require("./routes/auth");

// const Chat = require("./Chat");



// const app = express();



// // Middleware

// // app.use(cors({

// // origin:"*"

// // }));
// // app.use(cors())
// app.use(cors({

// origin:"*",

// methods:[
// "GET",
// "POST"
// ],

// allowedHeaders:[
// "Content-Type"
// ]

// }));

// app.use(express.json());



// // Auth

// app.use("/api/auth",authRoutes);






// // MongoDB


// mongoose.connect(
// process.env.MONGO_URI,
// {
// serverSelectionTimeoutMS:30000
// }

// )

// .then(()=>{

// console.log("MongoDB Connected");

// })

// .catch((error)=>{


// console.log(

// "MongoDB Error:",

// error.message

// );


// });








// // TEST


// app.get("/api/test",(req,res)=>{

// res.json({

// message:"Backend API working"

// });

// });

// app.get("/api/test",(req,res)=>{

// res.json({

// status:"API working"

// });

// });

// // =============================
// // GET ALL CHAT HISTORY SIDEBAR
// // =============================


// app.get(
// "/api/chats/:userId/:chatId",
// async(req,res)=>{


// try{


// const chats = await Chat.find({

// userId:req.params.userId


// })

// .sort({

// createdAt:-1

// });




// // remove duplicate chats


// const history=[];


// const ids=new Set();



// chats.forEach(chat=>{


// if(!ids.has(chat.chatId)){



// history.push({


// chatId:chat.chatId,


// title:
// chat.title ||
// "AI Event Planner Help"



// });



// ids.add(chat.chatId);



// }



// });



// res.json(history);



// }



// catch(error){



// console.log(
// "History error:",
// error
// );



// res.status(500).json({

// error:"History loading failed"

// });



// }


// });









// // =============================
// // LOAD ONE CHAT
// // =============================


// app.get(

// "/api/chats/:userId/:chatId",

// async(req,res)=>{


// try{


// const messages = await Chat.find({


// userId:req.params.userId,


// chatId:req.params.chatId


// })

// .sort({

// createdAt:1

// });



// res.json(messages);



// }


// catch(error){



// console.log(error);



// res.status(500).json({

// error:"Cannot load chat"

// });


// }


// });

// // =============================
// // AI CHAT API
// // =============================


// app.post(
// "/api/chat",
// async(req,res)=>{


// try{


// const {
// userId,
// chatId,
// message

// }=req.body;




// // call Gemini

// const reply = await chatWithAI(

// [],

// message,

// {},

// [],

// []

// );




// // save chat

// const existingChat = await Chat.findOne({
// chatId:chatId,
// userId:userId
// });


// await Chat.create({

// userId:userId,

// chatId:chatId,

// title:message.substring(0,40),

// role:"user",

// text:message

// });



// await Chat.create({


// userId:userId,


// chatId:chatId,


// role:"assistant",


// text:reply


// });





// res.json({

// reply:reply

// });




// }

// catch(error){


// console.log(

// "Chat API Error:",

// error

// );



// res.status(500).json({

// error:"AI service failed"

// });


// }


// });









// // =============================
// // SAVE CHAT (FOR CHATBOX)
// // =============================


// app.post(

// "/api/chats",

// async(req,res)=>{


// try{


// const chat = new Chat(req.body);



// await chat.save();



// res.json(chat);



// }


// catch(error){



// console.log(error);



// res.status(500).json({

// error:"Chat save failed"

// });


// }



// });











// // SERVER START


// const PORT =
// process.env.PORT || 5002;



// app.listen(

// PORT,

// "0.0.0.0",

// ()=>{


// console.log(

// `Server running on port ${PORT}`

// );


// }

// );

