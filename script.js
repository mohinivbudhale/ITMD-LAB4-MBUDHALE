
document.addEventListener("DOMContentLoaded", function () {
	
    const geolocationBtn = document.getElementById("geolocationBtn");
    const locationForm = document.getElementById("locationForm");
    const resultContainer = document.getElementById("resultContainer");
    const resultContainerTomorrow = document.getElementById("resultContainerTomorrow");
    const searchLocationBtn = document.getElementById("searchLocationBtn");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const errorMessageElement = document.getElementById("errormessage");
    const submitBtn = document.getElementById("submitBtn");

	function toggleSearchBar() {
        var form = document.getElementById('locationForm');
        form.classList.toggle('show-search-bar');
    }
    welcomeMessage.style.display = "block";
    resultContainer.style.display = "none";
    resultContainerTomorrow.style.display = "none";
    
    geolocationBtn.addEventListener("click", function () {
        welcomeMessage.style.display = "none";        
        getGeolocation();
    });
    
    submitBtn.addEventListener("click", function ()
    {
		showError("");
	});

    searchLocationBtn.addEventListener("click", function () {
		console.log('test test');
        welcomeMessage.style.display = "none";
        showError("");
        toggleSearchBar();
    });


    locationForm.addEventListener("submit", searchLocation);
    

    function getGeolocation() {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }    

    function searchLocation(event) {
        event.preventDefault();
        const locationInput = document.getElementById("locationInput").value;
        

        if (!locationInput.trim()) {
            alert("Please enter a location before searching.");
            return;
        }

        const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(locationInput)}`;

        fetch(geocodeApiUrl)
            .then(response => {
                if (!response.ok) {
					console.error(`Geocode API request failed with status: ${response.status}`);
                    throw new Error(`Geocode API request failed with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Geocode API Response:", data);

                if (data.length > 0) {
                    const result = data[0];

                    if (result.lat && result.lon) {
                        const latitude = result.lat;
                        const longitude = result.lon;

                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

                        fetchSunriseSunsetData(latitude, longitude);
                        fetchSunriseSunsetDataTomorrow(latitude, longitude);
                    } else {
                        showError("Latitude and longitude not found in the result");
                    }
                } else {
                    showError("Location not found");
                }
            })
            .catch(error => {
                console.error("Error fetching location data from Geocode API:", error);
                showError("Error fetching location data from Geocode API");
            });
    }

    function successCallback(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetchSunriseSunsetData(latitude, longitude);
        fetchSunriseSunsetDataTomorrow(latitude, longitude);
    }

    function errorCallback(error) {
        showError("Geolocation error: " + error.message);
    }

    function fetchSunriseSunsetData(latitude, longitude) {
        const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displaySunriseSunsetData(data.results))
            .catch(error => showError("Error fetching data from Sunrise Sunset API"));

        resultContainer.style.display = "block";
        resultContainerTomorrow.style.display = "block";
    }

    function fetchSunriseSunsetDataTomorrow(latitude, longitude) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tomorrowDateString = tomorrow.toISOString().split('T')[0];
        console.log(tomorrowDateString);
        const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${tomorrowDateString}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displaySunriseSunsetDataTomorrow(data.results))
            .catch(error => showError("Error fetching data from Sunrise Sunset API"));

        resultContainer.style.display = "block";
        resultContainerTomorrow.style.display = "block";
    }

    function displaySunriseSunsetData(data) {
        console.log(data);

        if (data.sunrise && data.sunset) {
            const sunriseTime = data.sunrise;
            const sunsetTime = data.sunset;
            const dawnTime = data.dawn;
            const duskTime = data.dusk;
            const dayLength = data.day_length ? `${data.day_length} seconds` : "N/A";
            const solarNoonTime = data.solar_noon;
            const timeZone = data.timezone || "N/A";

            resultContainer.innerHTML = `
                <h1>Today</h1>
                <div class="resultPair">
                    <div class="resultItem">
                        <i class="icon">☀️</i>
                        <p>Sunrise: ${sunriseTime}</p>
                    </div>
                    <div class="resultItem">
                        <i class="icon">🌅</i>
                        <p>Sunset: ${sunsetTime}</p>
                    </div>
                </div>
                <div class="resultPair">
                    <div class="resultItem">
                        <i class="icon">🌄</i>
                        <p>Dawn: ${dawnTime}</p>
                    </div>
                    <div class="resultItem">
                        <i class="icon">🌇</i>
                        <p>Dusk: ${duskTime}</p>
                    </div>
                </div>
                <div class="resultPair">
                    <div class="resultItem">
                        <i class="icon">⏳</i>
                        <p>Day Length: ${dayLength}</p>
                    </div>
                    <div class="resultItem">
                        <i class="icon">☀️</i>
                        <p>Solar Noon: ${solarNoonTime}</p>
                    </div>
                </div>
                <div class="resultItem">
                    <i class="icon">🌐</i>
                    <p>Time Zone: ${timeZone}</p>
                </div>
            `;
        } else {
            showError("Sunrise and sunset data not available");
        }
    }

    function displaySunriseSunsetDataTomorrow(data) {
        console.log(data);

        if (data.sunrise && data.sunset) {
            const sunriseTime = data.sunrise;
            const sunsetTime = data.sunset;
            const dawnTime = data.dawn;
            const duskTime = data.dusk;
            const dayLength = data.day_length ? `${data.day_length} seconds` : "N/A";
            const solarNoonTime = data.solar_noon;
            const timeZone = data.timezone || "N/A";

            resultContainerTomorrow.innerHTML = `
                <h1>Tomorrow</h1>
                <div class="resultPair">
                    <div class="resultItem">
                        <i class="icon">☀️</i>
                        <p>Sunrise: ${sunriseTime}</p>
                    </div>
                    <div class="resultItem">
                        <i class="icon">🌅</i>
                        <p>Sunset: ${sunsetTime}</p>
                    </div>
                </div>
                <div class="resultPair">
                    <div class="resultItem">
                        <i class="icon">🌄</i>
                        <p>Dawn: ${dawnTime}</p>
                    </div>
                    <div class="resultItem">
                        <i class="icon">🌇</i>
                        <p>Dusk: ${duskTime}</p>
                    </div>
                </div>
                <div class="resultPair">
                    <div class="resultItem">
                        <i class="icon">⏳</i>
                        <p>Day Length: ${dayLength}</p>
                    </div>
                    <div class="resultItem">
                        <i class="icon">☀️</i>
                        <p>Solar Noon: ${solarNoonTime}</p>
                    </div>
                </div>
                <div class="resultItem">
                    <i class="icon">🌐</i>
                    <p>Time Zone: ${timeZone}</p>
                </div>
            `;
        } else {
            showError("Sunrise and sunset data not available");
        }
    }
function showError(message) {    

    if (message) {
		console.log('it is true');
        errorMessageElement.innerHTML = `<p style="color: white;">${message}</p>`;
    } else {
		console.log('it is false');
        errorMessageElement.innerHTML = ""; 
    }
}

});
