
const {GoogleGenerativeAI}=require("@google/generative-ai");
// const currentDateTime = new Date();


const today = new Date().toLocaleDateString();

const currentYear = new Date().getFullYear();
// const currentTime =
// currentDateTime.toLocaleTimeString("en-IN");
const currentDateTime = new Date().toString();

const genAI =
new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);



async function chatWithAI(history, message,savedMemory,
weather,
venues){


try{


const model =
genAI.getGenerativeModel({

model:"gemini-2.5-flash"

});




let conversation="";



history.forEach(msg=>{


conversation += `

${msg.role}:

${msg.text}

`;

});





const prompt = `


You are an AI Event Planner chatbot.
CURRENT DATE:

${today}


IMPORTANT WEATHER RULE:

- Weather must be based on the EVENT DATE.
- Do not use current month.
- Do not guess.
- If event date is October, provide October weather.
- If event date is missing, ask for event date.

Current Date:
TIMELINE RULE:

Always compare today's date with event date.

Current date:

${currentDateTime}


If event date is within 7 days:

DO NOT create monthly planning.

Create only short preparation timeline.


Example:


Today:
23/06/2026


Event:
24/06/2026



Output:


⏰ TIMELINE


• 23/06/2026:
Confirm venue, food, guests and final arrangements.


• 24/06/2026:
Event day - Complete decoration and enjoy celebration.






If event is after many weeks/months:

Then create:

• 1 month before
• 2 weeks before
• 1 week before
• Event day


Never create old dates before today.

Never create past dates.

${today}


Current Time:

${currentDateTime}

Your job:

1. Create complete event plans.

Include:

- Event summary
- Timeline
- Budget breakdown
- Venue suggestions
- Food plan
- Decoration plan
- Guest management


Remember user preferences:
${history}



Always give structured answers.

Format:


EVENT PLAN

Event:
Date:

Timeline:

Budget:

Venue:

Food:

Decoration:

Recommendations:


Create complete event plans.


IMPORTANT:

Always answer in sections.

Use headings and bullet points.

Never write long paragraphs.



Format exactly:



🎉 EVENT PLAN

Event:
-




👥 GUEST DETAILS

•




📍 VENUE

•




⏰ TIMELINE

•

•



💰 BUDGET

•

•



🍴 FOOD PLAN

•

•



🎨 DECORATION

•

•



🌤️ WEATHER

•



✅ RECOMMENDATIONS

•

•



User request:

${message}



User memory:

${JSON.stringify(savedMemory)}



Weather:

${JSON.stringify(weather)}



Venues:

${venues.join(", ")}






Conversation:

${conversation}



Rules:


1. Talk like a friendly human event planner.


2. Remember previous messages.


3. Do not repeat questions already answered.


4. If user says hi/hello:

Greet them and introduce yourself.


5. If user wants an event:

Understand the event.

Ask only missing details.


Need details:

Event type

Date

Guests

Budget

Location



6. When enough information is available:

Create complete event plan.


Include:

Event Overview

Budget Breakdown

Venue Suggestions

Food Suggestions

Decoration Ideas

Timeline

Entertainment Ideas



7. If user asks unrelated questions:

Reply:

"I am an AI Event Planner. Please ask questions related to event planning."



8. Do not use:

#

*

markdown



Answer naturally.


Create a professional event plan.


IMPORTANT RULES:

- Give answers only in bullet points.
- Do not write paragraphs.
- Separate every category clearly.
- Use simple human friendly language.
- Do not use markdown symbols like # or *.
- Use headings with :


Format exactly:


Event Overview:

•


Budget Suggestions:

•


Venue Ideas:

•


Food Suggestions:

•


Decoration Ideas:

•


Timeline:

•


Entertainment Ideas:

•


Additional Tips:

•

Do not use:

#

*

markdown


`;






let result;


try{


result =
await model.generateContent(prompt);


}
catch(error){


console.log(
"Gemini first try failed:",
error.message
);



await new Promise(resolve =>
setTimeout(resolve,3000)
);



result =
await model.generateContent(prompt);


}



let answer =
result.response.text();


// remove markdown symbols

answer =
answer
.replace(/\*/g,"")
.replace(/#/g,"")
.trim();



return answer;
}



catch(error){


console.log(
"Gemini Error:",
error.message
);



return "AI service unavailable";


}



}



module.exports={

chatWithAI

};
// const { GoogleGenerativeAI } = require("@google/generative-ai");


// const genAI =
// new GoogleGenerativeAI(
// process.env.GEMINI_API_KEY
// );



// async function generateEventPlan(history){


// try{


// const model =
// genAI.getGenerativeModel({

// model:"gemini-1.5
// -flash"

// });



// let chat = "";


// history.forEach(message=>{


// chat += `

// ${message.role}:
// ${message.text}

// `;

// });



// const prompt = `


// You are an AI Event Planner chatbot.


// Conversation:

// ${chat}



// Your job:


// 1. Talk naturally like a human event planner.


// 2. If user only says:
// hi, hello, hey

// Reply:

// "Hello 👋 Welcome to AI Event Planner.
// How can I help you plan your event?"


// 3. If user mentions an event:

// Understand it.

// If details are missing ask only the missing details.

// Ask naturally:

// Date
// Guests
// Budget
// Location


// 4. When enough information is available:

// Generate complete event plan.


// Include:

// Event Overview

// Budget Suggestions

// Venue Ideas

// Food Suggestions

// Timeline

// Entertainment Ideas



// 5. If user asks unrelated questions:

// Reply:

// "I am an AI Event Planner. Please ask questions related to event planning."



// Rules:

// Remember previous messages.

// Do not repeat questions already answered.

// Do not use markdown.

// Do not use #.

// Do not use *.



// `;



// const result =
// await model.generateContent(prompt);



// return result.response.text();



// }


// catch(error){


// console.log(
// "Gemini Error:",
// error
// );


// return "AI service unavailable";

// }



// }



// module.exports={

// generateEventPlan

// };
// const { GoogleGenerativeAI } = require("@google/generative-ai");


// const genAI = new GoogleGenerativeAI(
//     process.env.GEMINI_API_KEY
// );



// async function generateEventPlan(userPrompt) {

//     try {


//         const model =
//         genAI.getGenerativeModel({

//             model:"gemini-2.5-flash"

//         });



// const prompt = `

// You are a professional AI Event Planner.

// Your role is ONLY event planning.

// You can help with:

// - Weddings
// - Birthday Parties
// - Corporate Events
// - Conferences
// - Engagements
// - Festivals
// - Team Outings
// - Family Gatherings

// If the user asks anything unrelated to event planning, reply:

// "I am an AI Event Planner. Please ask questions related to event planning."

// User Message:
// ${userPrompt}

// Provide a professional response.

// Do not use markdown.

// Do not use # or *.

// Use plain text.

// `;


//         const result =
//         await model.generateContent(prompt);



//         const response =
//         result.response.text();



//         return response;



//     }
//     catch(error){


//         console.log(
//             "Gemini Error:",
//             error.message
//         );


//         return `
// AI Event Planner is temporarily unavailable.

// Please try again after some time.


// `;

//     }

// }



// module.exports = {

//     generateEventPlan

// };