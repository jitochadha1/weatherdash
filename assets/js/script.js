const openWeatherApiKey = "47a48d325c81f8a4ca455f799cb84e86";


function displayForecastCard(date, temp, humidity) {
    const forecastCard = createForecastCard(date, temp, humidity);
    const forecastCardContainer = $("#forecast-cards");
    forecastCardContainer.append(forecastCard);
}


function createForecastCard(date, temp, humidity) {
    const forecastCard = $('<div></div>');
    forecastCard.addClass("forecast-card")

    // create date element
    const dateEl = $('<span></span>');
    dateEl.text(date);
    dateEl.addClass("forecast-card-item");
    forecastCard.append(dateEl);

    // create weather icon element
    const weatherIconEl = createWeatherIcon();
    forecastCard.append(weatherIconEl);

    // create temperature element
    const tempEl = $('<span></span>');
    tempEl.text(temp);
    tempEl.addClass("forecast-card-item");
    forecastCard.append(tempEl);

    // create humidity element
    const humidityEl = $('<span></span>');
    humidityEl.text(humidity);
    humidityEl.addClass("forecast-card-item");
    forecastCard.append(humidityEl);

    return forecastCard;
}

displayForecastCard("2/4/2021", "99F", "40%");

function createWeatherIcon() {
    const weatherIconEl = $('<i></i>');
    weatherIconEl.addClass("fa fa-sun-o");
    weatherIconEl.attr("aria-hidden", "true");
    return weatherIconEl;
}

function getCurrentWeather(city) {
    const fetchRequest = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`)
        .then(response => response.json())
    return fetchRequest;
}

getCurrentWeather("los angeles")
    .then(data => displayCurrentWeatherData(data));
    


function displayCurrentWeatherData(weatherData) {
    
    const city = weatherData.name
    displayCurrentCity(city);
    displayCurrentDate();
    const temp = weatherData.main.temp;
    const fahrTemp = kelvinToFahr(temp);
    displayCurrentFahrTemp(fahrTemp);

    const humidity = weatherData.main.humidity;
    displayCurrentHumidity(humidity);

    const windSpeed = weatherData.wind.speed;
    const windDirection = weatherData.wind.deg;
    displayCurrentWind(windSpeed, windDirection);

    const lat = weatherData.coord.lat;
    const lon = weatherData.coord.lon;

    getUvIndex(lat, lon).then(data => handleUvResponse(data));
    
}

function kelvinToFahr(temp) {
    const fahrTemp = (temp - 273.15)*9/5+32;
    return fahrTemp;
}

function getUvIndex(lat, lon) {
    const fetchRequest = fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${openWeatherApiKey}`)
        .then(response => response.json())
    return fetchRequest;
}

function handleUvResponse(responseData) {
    const uvIndex = responseData.current.uvi;
    displayCurrentUvIndex(uvIndex);
}

function displayCurrentFahrTemp(fahrTemp) {
    $("#current-temperature").text(fahrTemp.toFixed(1));
}

function displayCurrentHumidity(humidity) {
    $("#current-humidity").text(humidity);
}

function displayCurrentWind(windSpeed, windDirection) {
    $("#current-wind-speed").text(windSpeed);
}

function displayCurrentUvIndex(uvIndex) {
    $("#current-uv-index").text(uvIndex);
}

function displayCurrentDate() {
    const date = new Date().toLocaleDateString();
    $("#current-date").text(date);

}
function displayCurrentCity(city) {
    $("#city-search-term").text(city);
}

function handleSearchSubmit(event) {
    // event.preventDefault();
    const cityName = $("#city-name")
    console.log(cityName);
}

function initializePage() {
    $("#search-submit").click(handleSearchSubmit);
}