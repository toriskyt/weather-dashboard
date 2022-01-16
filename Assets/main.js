// 88b8ea86d4fcf64ec5b6edf5bb0f8492  = API key for weather-dashboard
// var APIKey = 88b8ea86d4fcf64ec5b6edf5bb0f8492;
// var city;

// 
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={APIKey}

//var displayE1 = $('#display');
//var clearE1 = $('clear');

const apiKey= "88b8ea86d4fcf64ec5b6edf5bb0f8492";

console.log('main js imported!');

async function getWeatherInfo(lat, long){
   // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
   const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={part}&appid=${apiKey}`);
   const data = await res.json();
   console.log("city weather: ", data);
}

async function getCityCoordinates(city){
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`);
    const data = await res.json();
    const { lat = 0.0, lon = 0.0 } = data[0];
    console.log('city coordinates: ', data);
    getWeatherInfo(lat, lon);
}
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//40.7128° N, 74.0060° W

getCityCoordinates("New York");
getWeatherInfo(48.7128, 74.0060);
