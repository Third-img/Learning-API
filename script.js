// Variables
const searchText = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-button");

searchText.addEventListener("focusin", () => {
  searchText.style.width = "300px";
});

searchText.addEventListener("focusout", () => {
  searchText.style.width = "200px";
});

searchText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeatherData();
  }
});

navigator.geolocation.getCurrentPosition(success);

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherData(lat, lon);
}

async function getWeatherData(lat, lon) {
  const weatherLocation = searchText.value.split(" ").join("+");

  try {
    // #region Weather Response
    let response;
    if (weatherLocation === "") {
      response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=62d4c358194d49c6ad970958250607&q=${lat},${lon}`
      );
    } else {
      response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=62d4c358194d49c6ad970958250607&q=${weatherLocation}`
      );
    }

    if (!response.ok) {
      throw new Error("There is an error with the response");
    }
    // #endregion

    const data = await response.json();
    const locationName = data.location.name;
    const locationRegion = data.location.region;
    const locationCountry = data.location.country;
    const currentTemp = Math.floor(data.current.windchill_c);
    const conditionName = data.current.condition.text;
    const tempHigh = Math.round(data.forecast.forecastday[0].day.maxtemp_c);
    const tempLow = Math.round(data.forecast.forecastday[0].day.mintemp_c);

    const container = document.querySelector(".container");

    container.innerHTML = `
    <div class="weather-location"></div>
        <div class="weather-temperature">
            <div id="weather-celcius">${currentTemp}</div>
            <div id="celcius-icon">°</div>
        </div>
        <div class="weather-type">${conditionName}</div>
        <div class="weather-highs-lows">
          <div class="weather-highs">H: ${tempHigh}</div>
          <div class="weather-lows">L: ${tempLow}</div>
        </div>
    `;

    //  Changes the location properly, since in some countries their region is the same as their name
    const fullLocation = document.querySelector(".weather-location");
    if (locationRegion === locationName || locationRegion === "") {
      fullLocation.textContent = `${locationCountry}, ${locationName}`;
    } else {
      fullLocation.textContent = `${locationRegion}, ${locationName} `;
    }

    const backgroundVideo = document.querySelector(".weather-condition");
    switch (conditionName.toLowerCase()) {
      case "clear":
        backgroundVideo.innerHTML = `<source src="videos/clear.mp4">`;
        break;
      case "sunny":
      case "cloudy":
      case "partly cloudy":
        backgroundVideo.innerHTML = `<source src="videos/cloudy.mp4">`;
        break;
      case "rain":
      case "heavy rain":
        backgroundVideo.innerHTML = `<source src="videos/rain.mp4">`;
        break;
      case "patchy rain nearby":
        backgroundVideo.innerHTML = `<source src="videos/light rain.mp4">`;
        break;
    }
    backgroundVideo.load();
    backgroundVideo.play();
  } catch (error) {
    console.error(error);
  }
}

searchBtn.addEventListener("click", getWeatherData);
