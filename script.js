const cityInput= document.querySelector(".city-input");
const searchButton=document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");


const API_KEY= "40cc04c5344a4d017c9a03ad73065f41";

const createWeathercard = (cityName,weatherItem,index) => {

	 if(index===0){ //HTML for the main weather card
		return `<div class="details">
					<h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
					<h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
					<h4>Wind : ${weatherItem.wind.speed} M/s</h4>
					<h4>Humidity: ${weatherItem.main.humidity}%</h4>
			</div>
			<div class="icon">
				<img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon" >
				<h4>${weatherItem.weather[0].description}</h4> 
			</div>
			</div>`;
	}
	else{  // HTML for other five  days forecast cards
		return `<li class="card">
					<h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
					<img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon" >
					<h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
					<h4>Wind : ${weatherItem.wind.speed} M/s</h4>
					<h4>Humidity: ${weatherItem.main.humidity}%</h4>
				</li>`
	}
	
}

const getWeatherDetails= (cityName, lat, lon) => {
	const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

	fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
		
		const uniqueForecastDays = [];
		const fiveDaysforecast = data.list.filter(forecast => {
			const forecastDate = new Date(forecast.dt_txt).getDate();
			if(!uniqueForecastDays.includes(forecastDate)){
				return uniqueForecastDays.push(forecastDate);
			}
		});

		// creating previous weather data

		cityInput.value="";
		currentWeatherDiv.innerHTML ="";
		weatherCardsDiv.innerHTML = "";

		// creating weather cards and adding them to the DOM
		fiveDaysforecast.forEach((weatherItem, index )=>{
			if(index===0){
				currentWeatherDiv.insertAdjacentHTML("beforeend", createWeathercard(cityName, weatherItem,index))
			}
			else{
				weatherCardsDiv.insertAdjacentHTML("beforeend", createWeathercard(cityName,weatherItem,index));
			}
		})


	}).catch(() =>{
		alert("An error occured while fetching the weather forecast!");
	})
}

const getCityCoordinates = () => {
	const cityName = cityInput.value.trim();
	if(!cityName) return;

	GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

	fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
		if(!data.length) return alert(`No coordinate found for ${cityName}`);
		const {name, lat, lon }= data[0];
		getWeatherDetails(name, lat, lon);
	}).catch(() => {
		alert("An error occured while fetching the coordinates!");
	});
}

searchButton.addEventListener("click", getCityCoordinates);