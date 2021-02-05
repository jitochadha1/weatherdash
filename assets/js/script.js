const openWeatherApiKey = "47a48d325c81f8a4ca455f799cb84e86";


function displayForecastCard(date, icon, temp, humidity) {
    const forecastCard = createForecastCard(date, icon, temp, humidity);
    const forecastCardContainer = $("#forecast-cards");
    forecastCardContainer.append(forecastCard);
}


function createForecastCard(date, icon, temp, humidity) {
    const forecastCard = $('<div></div>');
    forecastCard.addClass("forecast-card")

    // create date element
    const dateEl = $('<span></span>');
    dateEl.text(date);
    dateEl.addClass("forecast-card-item");
    forecastCard.append(dateEl);

    // create weather icon element
    const weatherIconEl = createWeatherIcon(icon);
    forecastCard.append(weatherIconEl);

    // create temperature element
    const tempEl = $('<span></span>');
    tempEl.text("Temp: "+temp+"F");
    tempEl.addClass("forecast-card-item");
    forecastCard.append(tempEl);

    // create humidity element
    const humidityEl = $('<span></span>');
    humidityEl.text("Humidity: "+humidity+"%");
    humidityEl.addClass("forecast-card-item");
    forecastCard.append(humidityEl);

    return forecastCard;
}

// displayForecastCard("2/4/2021", "99F", "40%");

function createWeatherIcon(icon) {
    const weatherIconEl = $('<img></img>');
    weatherIconEl.addClass("weather-icon");
    const iconLink = `http://openweathermap.org/img/w/${icon}.png`
    weatherIconEl.attr("src", iconLink);
    return weatherIconEl;
}

function getCurrentWeather(city) {
    const fetchRequest = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`)
        .then(response => response.json())
    return fetchRequest;
}

function getForecastWeather(lat, lon) {
    const fetchRequest = fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${openWeatherApiKey}`)
        .then(response => response.json())
    return fetchRequest;
}





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
    const fahrTemp = (temp - 273.15) * 9 / 5 + 32;
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
    const uvEl = $("#current-uv-index")
    uvEl.text(uvIndex);
    if(uvIndex > 7 ) {
        uvEl.addClass("severe-uv")
    } else if(uvIndex >4.5) {
        uvEl.addClass("moderate-uv")
    } else {
        uvEl.addClass("favorable-uv");
    }
}

function displayCurrentDate() {
    const date = new Date().toLocaleDateString();
    $("#current-date").text(date);

}
function displayCurrentCity(city) {
    $("#city-search-term").text(city);
}

function handleSearchSubmit() {

    const cityName = $("#city-name").val();
    getCurrentWeather(cityName)
        .then(data => {
            addSearchToHistory(data.name)
            displayCurrentWeatherData(data);
            const lat = data.coord.lat
            const lon = data.coord.lon
            getForecastWeather(lat, lon)
                .then(data => displayForecastWeatherData(data))
        })
        ;
}



function addSearchToHistory(city) {
    const searchHistory = getSearchHistory();
    searchHistory.push(city)
    const uniqueSearchHistorySet = new Set(searchHistory);
    const uniqueSearchHistoryArray = [...uniqueSearchHistorySet];
    saveHistoryToLocalStorage(uniqueSearchHistoryArray);
    displaySearchHistory();
}

function saveHistoryToLocalStorage(searchHistory) {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function initializePage() {
    $("#search-submit").click(handleSearchSubmit);
    displaySearchHistory();
}

function displayForecastWeatherData(weatherData) {
    $("#forecast-cards").empty();
    for(let i=1; i < 6; i++) {
        const dailyData = weatherData.daily[i];
        const date = getDate(dailyData.dt);
        const icon = dailyData.weather[0].icon;
        const temp = kelvinToFahr(dailyData.temp.day).toFixed(1)
        const humidity = dailyData.humidity
        displayForecastCard(date, icon, temp, humidity);
    }
    
}

function getDate(unformattedDate) {
    const date = new Date(unformattedDate*1000)
    return date.toLocaleDateString();
}

function displaySearchHistory() {
    const searchHistoryEl = $("#search-history")
    searchHistoryEl.empty();
    const searchHistory = getSearchHistory();
    searchHistory.forEach(city => {
        const searchItem = $("<button></button>")
        searchItem.addClass("search-history-item")
        searchItem.text(city)
        searchItem.click(() => {
            $("#city-name").val(city);
            handleSearchSubmit(city)
        })
        searchHistoryEl.append(searchItem);
    })
    

}

function getSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchHistory === null) {
        return [];
    } else {
        return searchHistory;
    }
}

initializePage();