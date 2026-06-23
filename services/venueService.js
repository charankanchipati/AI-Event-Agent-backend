const axios = require("axios");



async function getVenues(city){


try{


// 1. Get city coordinates using Nominatim

const locationResponse =
await axios.get(

`https://nominatim.openstreetmap.org/search`,

{

params:{

q:city,

format:"json",

limit:1

},

headers:{

"User-Agent":"AI-Event-Planner"

}

}

);



if(locationResponse.data.length===0){

return [];

}



const lat =
locationResponse.data[0].lat;


const lon =
locationResponse.data[0].lon;



// 2. Find venues near location


const query = `

[out:json];


(

node["amenity"="restaurant"](around:5000,${lat},${lon});

node["tourism"="hotel"](around:5000,${lat},${lon});

node["amenity"="community_centre"](around:5000,${lat},${lon});

way["amenity"="restaurant"](around:5000,${lat},${lon});

way["tourism"="hotel"](around:5000,${lat},${lon});


);


out center;

`;



const venueResponse =
await axios.post(

"https://overpass.kumi.systems/api/interpreter",

query,

{

headers:{

"Content-Type":"application/x-www-form-urlencoded",

"User-Agent":"AI-Event-Planner"

}

}

);



return venueResponse.data.elements
.slice(0,10)
.map(place=>({


name:

place.tags?.name || "Unnamed Venue",


type:

place.tags?.amenity ||

place.tags?.tourism ||


"Venue"


}));




}

catch(error){


console.log(

"Venue Error:",

error.message

);


return [];


}


}



module.exports = getVenues;