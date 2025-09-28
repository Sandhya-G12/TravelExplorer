const searchBtn = document.getElementById('search');
const destinationInput = document.getElementById('destination');
const photoDiv = document.getElementById('photo');
const weatherDiv = document.getElementById('weather');

// Your API keys
const UNSPLASH_KEY = 'jkuGtRysybvcexKd4vjVUBnS4qtUNs3a_CpyKWgxd3E';
const WEATHER_KEY = 'e6fc6be1107762a2abd9630d36b649fe';

searchBtn.addEventListener('click', () => {
    let place = destinationInput.value.trim();
    if (!place) return alert("Please enter a place!");

    // Capitalize first letters for better API match
    place = place.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    // --- Fetch photo from Unsplash ---
    fetch(`https://api.unsplash.com/search/photos?query=${place}&client_id=${UNSPLASH_KEY}&per_page=1`)
        .then(res => res.json())
        .then(data => {
            if (data.results.length > 0) {
                photoDiv.innerHTML = `<img src="${data.results[0].urls.regular}" alt="${place}">`;
            } else {
                photoDiv.innerHTML = "<p>No photo found.</p>";
            }
        })
        .catch(err => {
            console.error("Photo fetch error:", err);
            photoDiv.innerHTML = "<p>Error fetching photo.</p>";
        });

    // --- Fetch weather from OpenWeatherMap ---
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${WEATHER_KEY}&units=metric`)
        .then(res => {
            console.log("Weather response status:", res.status);
            return res.json();
        })
        .then(data => {
            console.log("Weather data:", data);

            if (data.cod === 200) {
                weatherDiv.innerHTML = `
                    <h3>${data.name} Weather</h3>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Condition: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                `;
            } else if (data.cod === "404") {
                weatherDiv.innerHTML = "<p>City not found. Check spelling!</p>";
            } else if (data.cod === 401) {
                weatherDiv.innerHTML = "<p>Invalid API key. Check your WEATHER_KEY!</p>";
            } else {
                weatherDiv.innerHTML = `<p>Weather info not available. Error: ${data.message}</p>`;
            }
        })
        .catch(err => {
            console.error("Weather fetch error:", err);
            weatherDiv.innerHTML = "<p>Error fetching weather.</p>";
        });
});
