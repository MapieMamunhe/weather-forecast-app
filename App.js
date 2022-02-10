import React, { useState, useEffect } from "react";
//Para pegar a localizacao do dispositivo
import * as Location from "expo-location";
import ConvertTemperature from "./components/classes/convertTemperature";
import renderTemperatureView from "./components/pages/appBody";

export default function App() {
  const [cityNameState, setCityName] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [temperatureData, setTemperature] = useState(null);

  const locationData = (() => {
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);

    let text;
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = location;
    }
    return text;
  })();
  let completeRender;
  const incompleteRendering = renderTemperatureView(cityNameState);
  if (locationData === undefined) {
    return incompleteRendering;
  }

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

  if (temperatureData === null) return incompleteRendering;

  const temperatureInFarhrenheit = { ...temperatureData };

  let convert = new ConvertTemperature();
  const tempCelcius = convert.fahrenheitToCelcius(
    temperatureInFarhrenheit.temp
  );
  const temp_minCelcius = convert.fahrenheitToCelcius(
    temperatureInFarhrenheit.temp_min
  );
  const temp_maxCelcius = convert.fahrenheitToCelcius(
    temperatureInFarhrenheit.temp_max
  );
  const temperatureInCelcius = {
    tempCelcius,
    temp_minCelcius,
    temp_maxCelcius,
  };

  completeRender = renderTemperatureView(
    cityNameState,
    temperatureInFarhrenheit,
    temperatureInCelcius
  );
  return completeRender;
}
