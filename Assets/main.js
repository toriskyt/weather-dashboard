// 88b8ea86d4fcf64ec5b6edf5bb0f8492  = API key for weather-dashboard
// var APIKey = 88b8ea86d4fcf64ec5b6edf5bb0f8492;
// var city;

// 
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={APIKey}

//var displayE1 = $('#display');
//var clearE1 = $('clear');

const apiKey= "88b8ea86d4fcf64ec5b6edf5bb0f8492";

console.log('main js imported!');

function getUVColor(val){
    if(val <= 2.0){
      return "green";
    } else if(val > 2.0 && val <= 7.0){
        return "yellow";
    } else if(val > 7.0){
        return "red";
    }
}

async function getWeatherInfo(lat, long){
   // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
   const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={part}&appid=${apiKey}`);
   const data = await res.json();
   console.log("city weather: ", data);
   console.log('current weather: ', data.current);
   const { temp, wind_speed, humidity, uvi } = data.current;
   const tempInfo = document.getElementById("tempInfo");
   tempInfo.innerHTML = "Temp: " + kelvinToFahrenheit(temp) + "<span>&#176;</span>F";

   const windInfo = document.getElementById("windInfo");
   windInfo.innerHTML = `Wind Speed: ${wind_speed} MPH`; 

   const humidityInfo = document.getElementById("humidityInfo");
   humidityInfo.innerHTML = `Humidity: ${humidity} %`;

   const uvInfo = document.getElementById("uvInfo");
   const uviDiv = document.createElement("div");
   uviDiv.innerText = uvi;
   uviDiv.style.backgroundColor = getUVColor(uvi);
   uviDiv.style.color = "white";
   uviDiv.style.display = "inline-block";
   uviDiv.style.paddingLeft = "0.5%";
   uviDiv.style.width = "40px";
   uviDiv.style.borderRadius = "5px";

   uvInfo.innerHTML = "UV Index: ";
   uvInfo.appendChild(uviDiv);
}


function buildCard(forecastData){
    //date, icon, Temp,  Wind humidity
    const cardHolder = document.getElementById("forecastCards");
    cardHolder.innerHTML = '';
    for(let i = 0; i < forecastData.length; i++){
        const cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card");
        cardDiv.style.width = "18rem";
        cardDiv.style.marginRight = "20px";

        const { date, icon, temp, wind, humidity } = forecastData[i];
        const formattedDate = getFormattedDate(new Date(date));
        
        const dateDiv = document.createElement("div");
        dateDiv.innerText = `(${formattedDate})`;
        dateDiv.style.fontWeight = "bold";
        dateDiv.style.fontSize = "20px";

        const iconDiv = document.createElement("div");
        iconDiv.style.paddingTop = "15px";
        const imageIcon = document.createElement("img");
        const iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        imageIcon.setAttribute("src", iconurl);
        iconDiv.appendChild(imageIcon);

        const tempDiv = document.createElement("div");
        tempDiv.style.paddingTop = "15px";
        tempDiv.innerHTML = "Temp: " + temp + "<span>&#176;</span>F";

        const windDiv = document.createElement("div");
        windDiv.style.paddingTop = "15px";
        windDiv.innerText = `Wind: ${wind} MPH`;

        const humidityDiv = document.createElement("div");
        humidityDiv.style.paddingTop = "15px";
        humidityDiv.innerText = `Humidity: ${humidity} %`;


        cardDiv.appendChild(dateDiv);
        cardDiv.appendChild(iconDiv);
        cardDiv.appendChild(tempDiv);
        cardDiv.appendChild(windDiv);
        cardDiv.appendChild(humidityDiv);

        cardHolder.append(cardDiv);
    }
}

async function getCityForecast(city){
    //api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
    const res = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial
    `);
    const data = await res.json();
    console.log("forecast data: ", data.list);
    const weatherForecastData = [];
    for(let i = 7; i <= 39; i = i + 8){
        const { dt_txt, weather, wind, main } = data.list[i];
        console.log('data: ', data.list[i]);
        weatherForecastData.push({ date: dt_txt, icon: weather[0].icon, wind: wind.speed, temp: main.temp, humidity: main.humidity });
    }
    buildCard(weatherForecastData);
    console.log("filtered Data: ", weatherForecastData);
}

async function getCityCoordinates(city){
    const cityName = document.getElementById("cityInfo");
    cityName.innerText = `${city} (${getFormattedDate(new Date())})`;
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`);
    const data = await res.json();
    const { lat = 0.0, lon = 0.0 } = data[0];
    console.log('city coordinates: ', data);
    getWeatherInfo(lat, lon);
    getCityForecast(city);
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

function getFormattedDate(date) {
  var year = date.getFullYear();
  
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
    
  return month + '/' + day + '/' + year;
}
  
async function populateInitialCity(){
    getCityCoordinates("Atlanta");
}
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//40.7128° N, 74.0060° W

populateCities();
populateInitialCity();
