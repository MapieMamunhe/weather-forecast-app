import React, { useState, useEffect } from "react";
//Para pegar a localizacao do dispositivo
import * as Location from "expo-location";
import ConvertTemperature from "./components/classes/convertTemperature";
import temperatureViewArea from "./components/pages/appBody";
import {
  setDefaultCityName,
  setDefaultTemperature,
} from "./components/defaults";

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

  const incompleteRendering = temperatureViewArea(cityNameState);
  if (locationData === undefined) {
    return incompleteRendering;
  }

  setDefaultCityName(cityNameState, setCityName, locationData);

  setDefaultTemperature(temperatureData, setTemperature, locationData);

  if (temperatureData === null) return incompleteRendering;

  const { temperatureInFarhrenheit, temperatureInCelcius } =
    getTemperatures(temperatureData);

  const completeRender = temperatureViewArea(
    cityNameState,
    temperatureInFarhrenheit,
    temperatureInCelcius
  );
  return completeRender;
}
function getTemperatures(temperatureData) {
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
  return { temperatureInFarhrenheit, temperatureInCelcius };
}
