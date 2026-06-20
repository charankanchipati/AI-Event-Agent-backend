require("dotenv").config();


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const { chatWithAI } = require("./aiService");
const Chat = require("./chat");



const app = express();



// Middleware

app.use(cors());

app.use(express.json());




// MongoDB Connection


mongoose.connect(process.env.MONGO_URI)

.then(()=>{

    console.log("MongoDB Connected");

})

.catch((error)=>{


    console.log(

        "MongoDB Error:",

        error.message

    );


});






// Test API


app.get("/",(req,res)=>{


    res.send(
        "AI Event Planner Backend Running"
    );


});







// ===============================
// SEND MESSAGE
// ===============================


app.post("/api/chat", async(req,res)=>{


try{


const {

    userId,

    chatId,

    message


}=req.body;





if(!userId || !message){


return res.json({


reply:"Please enter message"


});


}







// Get old chat history


const oldChats = await Chat.find({


    userId:userId,

    chatId:chatId


})

.sort({

    createdAt:1

});






let history = oldChats.map(chat=>({


    role:chat.role,


    text:chat.text


}));








// Save user message


await Chat.create({


    userId:userId,

chatId:chatId,

title:message.substring(0,30),

role:"user",

text:message


});






history.push({


    role:"user",


    text:message


});









// AI Generate Response


const reply = await chatWithAI(history);







// Save AI response


await Chat.create({


    userId:userId,


    chatId:chatId,


    role:"assistant",


    text:reply


});







res.json({


    reply:reply


});






}

catch(error){


console.log(

    "Server Error:",

    error

);



res.status(500).json({


reply:"Something went wrong"


});


}



});











// ===============================
// LOAD CHAT HISTORY
// ===============================


app.get("/api/chats/:userId/:chatId", async(req,res)=>{


try{


const chats = await Chat.find({

userId:req.params.userId,

chatId:req.params.chatId

})
.sort({

createdAt:1

});



res.json(chats);



}

catch(error){


console.log(error);


res.status(500).json({

error:"Cannot load chat"

});


}


});



// SERVER START


const PORT = process.env.PORT || 5002;



if(process.env.NODE_ENV !== "production"){

app.listen(PORT,()=>{

console.log(
`Server running on port ${PORT}`
);

});

}


module.exports = app;

// require("dotenv").config();
// const mongoose = require("mongoose"); //db
// const express = require("express");
// const cors = require("cors");

// const { chatWithAI } = require("./aiService");

// const app = express();

// app.use(cors());

// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI) //db connection
// .then(() => {
//     console.log("MongoDB Connected");
// })
// .catch((error) => {
//     console.log("MongoDB Error:", error.message);
// });

// // temporary memory

// const conversations = {};

// app.get("/",(req,res)=>{

//     res.send("AI Event Planner Backend Running");

// });

// app.post("/api/chat", async(req,res)=>{

// try{

// const {userId,message}=req.body;

// if(!conversations[userId]){

//     conversations[userId]=[];

// }

// // save user message

// conversations[userId].push({

//     role:"user",

//     text:message

// });

// const reply =
// await chatWithAI(
//     conversations[userId]
// );

// // save AI reply

// conversations[userId].push({

//     role:"assistant",

//     text:reply

// });

// res.json({

//     reply:reply

// });

// }

// catch(error){

// console.log(error);

// res.status(500).json({

// reply:"Something went wrong"

// });

// }

// });

// mongoose.connect(process.env.MONGO_URI) //db connection
// .then(()=>{

// console.log("MongoDB Connected");

// })
// .catch((error)=>{

// console.log("MongoDB Error:",error);

// }); //end of db connection

// const PORT =
// process.env.PORT || 5002;

// app.listen(PORT,()=>{

// console.log(
// `Server running on port ${PORT}`
// );

// });
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const { generateEventPlan } = require("./aiService");

// const app = express();

// app.use(cors());

// app.use(express.json());

// // temporary chat memory

// const chatHistory = {};

// app.get("/", (req, res) => {

//     res.send("AI Event Planner Backend Running");

// });

// app.post("/api/chat", async (req, res) => {

//     try {

//         const { userId, message } = req.body;

//         if (!userId || !message) {

//             return res.json({

//                 reply: "Please enter a message"

//             });

//         }

//         // create new user chat

//         if (!chatHistory[userId]) {

//             chatHistory[userId] = [];

//         }

//         // save user message

//         chatHistory[userId].push({

//             role: "User",

//             text: message

//         });

//         // send conversation to AI

//         const reply =
//             await generateEventPlan(
//                 chatHistory[userId]
//             );

//         // save AI response

//         chatHistory[userId].push({

//             role: "AI",

//             text: reply

//         });

//         res.json({

//             reply: reply

//         });

//     }

//     catch(error){

//         console.log(
//             "Server Error:",
//             error
//         );

//         res.status(500).json({

//             reply:
//             "Something went wrong"

//         });

//     }

// });

// const PORT = process.env.PORT || 5002;

// app.listen(PORT,()=>{

//     console.log(
//         `Server running on port ${PORT}`
//     );

// });
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const { generateEventPlan } =
// require("./aiService");

// const app = express();

// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5002;

// const sessions = {};

// function createSession(userId){

//     sessions[userId] = {

//         step:0,

//         answers:{},

//         history:[]

//     };

// }

// app.get("/", (req, res) => {
//     res.send("AI Event Planner Backend Running");
// });

// app.post("/api/chat", async (req,res)=>{

//     const {message}=req.body;

//     const text = message.toLowerCase();

//     // Greeting
//     if(
//         text.includes("hi") ||
//         text.includes("hello") ||
//         text.includes("hey")
//     ){

//         return res.json({

//             reply:
// `Hello 👋 Welcome to AI Event Planner.

// I can help you plan:

// Wedding
// Birthday Party
// Corporate Event
// College Event

// What type of event would you like to plan?`

//         });

//     }

//     try{

//         const reply =
//         await generateEventPlan(message);

//         res.json({

//             reply

//         });

//     }
//     catch(error){

//         console.log(error);

//         res.json({

//             reply:
//             "Sorry, I am unable to respond right now."

//         });

//     }

// });

// app.get("/api/history/:userId",(req,res)=>{

//     const userId =
//     req.params.userId;

//     if(!sessions[userId]){

//         return res.json({

//             history:[]

//         });

//     }

//     res.json({

//         history:
//         sessions[userId].history

//     });

// });
// app.listen(PORT, () => {

//     console.log(
//         `Server Running On Port ${PORT}`
//     );
// });
