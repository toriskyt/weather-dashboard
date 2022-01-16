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
   console.log('current weather: ', data.current);
   const temp = data.current.temp;
   const tempInfo = document.getElementById("tempInfo");
   tempInfo.innerHTML = "Temp:" + kelvinToFahrenheit(temp) + "<span>&#176;</span>F";

}

async function getCityCoordinates(city){
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`);
    const data = await res.json();
    const { lat = 0.0, lon = 0.0 } = data[0];
    console.log('city coordinates: ', data);
    getWeatherInfo(lat, lon);
}

async function searchCityWeather(){
    const city = document.getElementById("citysearch").value;
    getCityCoordinates(city);
}

function populateCities() {
    const cities = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "Atlanta"];
    cities.forEach(city => {
        const cityDiv = document.createElement("div");
        const button = document.createElement("button");
        button.innerText = city;
        button.onclick = function(){
            getCityCoordinates(city);
        }
        button.setAttribute("id", city);
        cityDiv.appendChild(button);
        const citysection = document.getElementById("cityselection");
        citysection.appendChild(cityDiv);
    });
}

function kelvinToFahrenheit(kelvinDegree){
    const fahrenheit = ((kelvinDegree - 273.15) * 1.8) + 32;
    return fahrenheit.toFixed(2);
}

function getTodayFormattedDate() {
  const date = new Date();
  var year = date.getFullYear();
  
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
    
  return month + '/' + day + '/' + year;
}
  
async function populateInitialCity(){
    getCityCoordinates("Atlanta");
    const cityName = document.getElementById("cityInfo");
    cityName.innerText = `Atlanta (${getTodayFormattedDate()})`;
}
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//40.7128° N, 74.0060° W

populateCities();
populateInitialCity();
