import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
//Para pegar a localizacao do dispositivo
import * as Location from "expo-location";
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
  const incompleteRendering = (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão do tempo</Text>
      <Text>
        {cityNameState === null ? "Localização não definida" : cityNameState}
      </Text>
      <Text style={styles.textTemperature}>Temperatura</Text>
      <StatusBar style="auto" />
    </View>
  );
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

  const { temp, temp_min, temp_max } = temperatureData;

  completeRender = (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão do tempo</Text>
      <Text>{cityNameState}</Text>
      <Text style={styles.textTemperature}>Temperatura Actual: {temp}F</Text>
      <Text style={styles.textTemperature}>
        Temperatura Minima: {temp_min}F
      </Text>
      <Text style={styles.textTemperature}>Temperatura Max: {temp_max}F</Text>
      <StatusBar style="auto" />
    </View>
  );
  return completeRender;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  textTemperature: {
    fontSize: 20,
    fontWeight: "200",
  },
});
