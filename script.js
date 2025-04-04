//API
// login in this website to get your city api key : https://www.api-ninjas.com/api/city
// login in this website to get your weather api key : https://www.weatherapi.com/
const city_api_key = 'city-api-key'; 
const weather_api_key = 'weather-api-key';

const city_input = document.getElementById('city-input');
const city_suggestion = document.getElementById('city-suggestion');
const weather_result = document.getElementById('weather-result');

let city_name = "";

async function suggestCity(cityName) {
    if (!cityName) {
        city_suggestion.style.display = "none";
        return;
    }
    try {
        city_suggestion.innerHTML = "Loading...";
        city_suggestion.style.display = "flex";
        const response = await fetch(
            `https://api.api-ninjas.com/v1/city?name=${cityName}`,
            { headers: { 'X-Api-Key': city_api_key } }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();

        if (data.length === 0) {
            city_suggestion.innerHTML = "No city found";
        } else {
            city_suggestion.innerHTML = `${data[0].name} - ${data[0].country}`;
            city_name = data[0].name;
        }
    } 
    catch (error) {
        city_suggestion.innerHTML = `Error: ${error.message}`;
    }
}

async function showData() {
    city_suggestion.style.display = "none";
    city_input.value = "";
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weather_api_key}&q=${city_name}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        weather_result.innerHTML = `<img src=${data.current.condition.icon} alt='weather-condition-icon'/><br/>
                                    <h2>${data.location.name}</h2>
                                    <div>
                                        <p>Temperature : ${data.current.temp_c}°C</p>
                                        <p>Feels Like : ${data.current.feelslike_c}°C</p>
                                        <p>Wind Speed : ${data.current.wind_kph}km/h</p>
                                        <p>Humidity : ${data.current.humidity}</p>
                                        <p>Air Condition : ${data.current.condition.text}</p>
                                    </div>
                                    `
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
}

city_input.addEventListener("keydown",function (event){
    if(event.key=="Enter"){
        showData()
    }
})