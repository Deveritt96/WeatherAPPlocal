document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("city").value;
    fetchWeather(city);
    saveCityToLocalStorage(city);
});

document.addEventListener("DOMContentLoaded", function() {
    loadStoredCities();
});

function loadStoredCities() {
    const storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    const storedCitiesContainer = document.getElementById('storedCities');
    storedCitiesContainer.innerHTML = '';
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
}

function saveCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
        loadStoredCities();
    }
};

function fetchWeather(city) {
    const apiKey = 'f2046faa5fb1f80c64e26de7f08054f2'; // Replace with your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const currentWeather = data.list[0];
            const currentTemperature = currentWeather.main.temp;
            const currentWindSpeed = currentWeather.wind.speed;
            const currentHumidity = currentWeather.main.humidity;
            const currentCondition = currentWeather.weather[0].main;
            const currentIcon = currentWeather.weather[0].icon;
            const currentDate = new Date(currentWeather.dt * 1000).toLocaleDateString();

            document.getElementById('currentWeather').innerHTML = `
                <h2>Current Weather - ${currentDate}</h2>
                <div class="flex items-center justify-center"> <!-- Add a flex container -->
                <p>Condition: ${currentCondition}</p>
                <img src="http://openweathermap.org/img/wn/${currentIcon}.png" alt="Weather Icon" class="ml-2"> <!-- Add margin-left for spacing -->
            </div>
                <p>Temperature: ${currentTemperature}°F</p>
                <p>Wind Speed: ${currentWindSpeed} m/s</p>
                <p>Humidity: ${currentHumidity}%</p>
            `;

            const forecast = data.list.slice(1, 6);
            forecast.forEach((day, index) => {
                const temperature = day.main.temp;
                const windSpeed = day.wind.speed;
                const humidity = day.main.humidity;
                const condition = day.weather[0].main; // Get the weather condition
                const icon = day.weather[0].icon; // Get the weather icon code
                const date = new Date(day.dt * 1000).toLocaleDateString();

                // Update placeholder box for each day with actual forecast data
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
        .catch(error => console.error('Error fetching weather:', error));
}
