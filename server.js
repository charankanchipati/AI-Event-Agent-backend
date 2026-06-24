require("dotenv").config();
console.log("THIS IS MY LATEST SERVER FILE");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { chatWithAI } = require("./aiService");

const authRoutes = require("./routes/auth");
const PDFDocument = require("pdfkit");
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

//  title://
//  chat.title || "New Chat"//

title:
chat.title || chat.text.substring(0,40)


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

app.post("/api/export-pdf",(req,res)=>{


const doc = new PDFDocument();


res.setHeader(
"Content-Type",
"application/pdf"
);


res.setHeader(
"Content-Disposition",
"attachment; filename=event-plan.pdf"
);


doc.pipe(res);



doc.fontSize(20)
.text("AI Event Planner");


doc.moveDown();


doc.fontSize(12)
.text(req.body.content);



doc.end();



});


app.post(
"/api/chat",
async(req,res)=>{


try{


const {

userId,

chatId,

message


}=req.body;




// MEMORY

// let memory = {

// event:"Not selected",

// guests:"Not selected",

// budget:"Not selected",

// location:"Not selected"

// };



// const text = message.toLowerCase();



// if(text.includes("birthday")){

// memory.event="Birthday";

// }


// if(text.includes("wedding")){

// memory.event="Wedding";

// }


// if(text.includes("party")){

// memory.event="Party";

// }



// let budgetMatch = message.match(/\d+/);


// if(budgetMatch){

// memory.budget = budgetMatch[0];

// }




// GET OLD CHAT HISTORY


const previousMessages = await Chat.find({

userId:userId,

chatId:chatId

})

.sort({

createdAt:1

});





// AI RESPONSE


const reply = await chatWithAI(

previousMessages,

message,

memory,

[],

[]

);






// OLD CHAT TITLE


let chatTitle = "New Chat";


const lowerMessage = message.toLowerCase();


if(lowerMessage.includes("wedding")){

chatTitle = "Wedding Event";

}

else if(lowerMessage.includes("birthday")){

chatTitle = "Birthday Event";

}

else if(lowerMessage.includes("party")){

chatTitle = "Party Event";

}

else if(lowerMessage.includes("conference")){

chatTitle = "Conference Event";

}

else{

chatTitle = message.substring(0,25) + "...";

}



if(text.includes("birthday")){

chatTitle="Birthday Event";

}

else if(text.includes("wedding")){

chatTitle="Wedding Event";

}

else if(text.includes("party")){

chatTitle="Party Event";

}

else if(text.includes("conference")){

chatTitle="Conference Event";

}







// SAVE USER MESSAGE


await Chat.create({

userId:userId,

chatId:chatId,

title:chatTitle,

role:"user",

text:message

});






// SAVE AI MESSAGE


await Chat.create({

userId:userId,

chatId:chatId,

title:chatTitle,

role:"assistant",

text:reply

});








// SEND RESPONSE


res.json({

reply:reply,

// memory:memory


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

