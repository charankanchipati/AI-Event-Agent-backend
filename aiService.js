const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);



async function generateEventPlan(userPrompt) {

    try {


        const model =
        genAI.getGenerativeModel({

            model:"gemini-2.0-flash"

        });



        const prompt = `

You are an AI Event Planner.

Create a professional event plan.

User Details:

${userPrompt}


Output rules:

Do not use markdown.

Do not use symbols like:
#
*
**

Use simple plain text.

Use clear headings.


Include:

Event Overview

Budget Suggestions

Venue Ideas

Food Suggestions

Timeline

Entertainment Ideas

`;


        const result =
        await model.generateContent(prompt);



        const response =
        result.response.text();



        return response;



    }
    catch(error){


        console.log(
            "Gemini Error:",
            error.message
        );


        return `
AI Event Planner is temporarily unavailable.

Please try again after some time.
`;

    }

}



module.exports = {

    generateEventPlan

};