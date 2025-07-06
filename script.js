async function getWeatherData() {
    const weatherLocation = "Malolos";
    try {
    // #region Weather Response
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=62d4c358194d49c6ad970958250607&q=${weatherLocation}+Philippines`
    );

    if (!response.ok) {
      throw new Error("There is an error with the response");
    }
    // #endregion

    const data = await response.json();
    const locationName = data.location.name;
    const locationRegion = data.location.region;
    const currentTemp = Math.round(data.current.temp_c);
    const conditionName = data.current.condition.text;
    const tempHigh = Math.round(data.forecast.forecastday[0].day.maxtemp_c);
    const tempLow = Math.round(data.forecast.forecastday[0].day.mintemp_c);

    const container = document.querySelector(".container");
    container.innerHTML = `
    <div class="weather-location">${locationRegion}, ${locationName}</div>
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
  } catch (error) {
    console.error(error);
  }
}

const reloadBtn = document.getElementById("reload-button");
reloadBtn.addEventListener("click", getWeatherData);