const axios = require("axios");


async function getWeather(city){


try{


const response = await axios.get(

`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric`

);



return {


temperature:
response.data.main.temp + "°C",


condition:
response.data.weather[0].description


};



}

catch(error){


console.log(
"Weather Error:",
error.message
);


return {

temperature:"N/A",

condition:"Unavailable"

};


}


}



module.exports = getWeather;