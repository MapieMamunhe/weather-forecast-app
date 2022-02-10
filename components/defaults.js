export function setDefaultCityName(cityNameState, setCityName, locationData) {
  (async function setDefautlCityName(locationData) {
    if (cityNameState !== null) return;
    const { latitude, longitude } = locationData.coords;
    const data = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=ae920a5b06307a00f99754fb6aedf942`
    );
    if (data.status !== 200) return;
    const responseData = await data.json();
    const cityName = responseData[0].name;
    setCityName(cityName);
  })(locationData);
}

export function setDefaultTemperature(
  temperatureData,
  setTemperature,
  locationData
) {
  (async (locationData) => {
    if (temperatureData !== null) return;
    const { latitude, longitude } = locationData.coords;
    const data = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=ae920a5b06307a00f99754fb6aedf942`
    );
    if (data.status !== 200) return;
    const responseData = await data.json();

    const temperature = responseData.main;
    setTemperature((prev) => {
      return {
        temp: temperature.temp,
        temp_max: temperature.temp_max,
        temp_min: temperature.temp_min,
      };
    });
  })(locationData);
}
