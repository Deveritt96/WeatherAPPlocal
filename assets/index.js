// Listens for the search button and runs the functions
document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("city").value;
    fetchWeather(city);
    saveCityToLocalStorage(city);
});
// on page load, loads the locally stored cities
document.addEventListener("DOMContentLoaded", function() {
    loadStoredCities();
});
// loads the cities in order from newest to oldest in the footer
function loadStoredCities() {
    const storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    const storedCitiesContainer = document.getElementById('storedCities');
    storedCitiesContainer.innerHTML = '';
    storedCities.reverse(); // Reverse the order of stored cities
    storedCities.forEach(city => {
        const cityLink = document.createElement('a');
        cityLink.href = '#';
        cityLink.textContent = city;
        cityLink.addEventListener('click', function(event) {
            event.preventDefault();
            fetchWeather(city);
        });
        storedCitiesContainer.appendChild(cityLink);
        storedCitiesContainer.appendChild(document.createElement('br'));
    });
};
// saves the cities in a json format so multiple can be stored
function saveCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        if (cities.length >= 4) {
            cities.shift();
        }
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
        loadStoredCities();
    }
};

//fetches the weather
function fetchWeather(city) {
    const apiKey = 'f2046faa5fb1f80c64e26de7f08054f2'; // Replace with your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const cityName = data.city.name;
            const currentWeather = data.list[0];
            const currentTemperature = currentWeather.main.temp;
            const currentWindSpeed = currentWeather.wind.speed;
            const currentHumidity = currentWeather.main.humidity;
            const currentCondition = currentWeather.weather[0].main;
            const currentIcon = currentWeather.weather[0].icon;
            const currentDate = new Date(currentWeather.dt * 1000).toLocaleDateString();

// modifies the existing html to update the current weather
            document.getElementById('currentWeather').innerHTML = `
            <h2>Current Weather - ${cityName}, ${currentDate}</h2>
                <div class="flex items-center justify-center"> <!-- Add a flex container -->
                <p>Condition: ${currentCondition}</p>
                <img src="http://openweathermap.org/img/wn/${currentIcon}.png" alt="Weather Icon" class="ml-2"> <!-- Add margin-left for spacing -->
            </div>
                <p>Temperature: ${currentTemperature}°F</p>
                <p>Wind Speed: ${currentWindSpeed} m/s</p>
                <p>Humidity: ${currentHumidity}%</p>
            `;
// modifies the placeholder boxes to be updated with the 5 day forecast.
            const forecast = data.list.slice(1, 6);
            forecast.forEach((day, index) => {
                const temperature = day.main.temp;
                const windSpeed = day.wind.speed;
                const humidity = day.main.humidity;
                const condition = day.weather[0].main;
                const icon = day.weather[0].icon;
                const date = new Date(day.dt * 1000).toLocaleDateString();

            
                const forecastBox = document.getElementById(`day${index + 1}`);
                forecastBox.innerHTML = `
                    <h3>Day ${index + 1}</h3>
                    <p>Date: ${date}</p>
                    <div class="flex items-center justify-center"> <!-- Add a flex container -->
                        <p>Condition: ${condition}</p>
                        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon" class="ml-2"> <!-- Add margin-left for spacing -->
                    </div>
                    <p>Temperature: ${temperature}°F</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                    <p>Humidity: ${humidity}%</p>
                `;
            });
        })
        // error if we get it.
        .catch(error => console.error('Error fetching weather:', error));
}
