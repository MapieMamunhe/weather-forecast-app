import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
export default function App() {
  const locationData = getLocation();
  let appRender;
  if (locationData === undefined) {
    appRender = (
      <View style={styles.container}>
        <Text style={styles.title}>Previsão do tempo</Text>
        <Text style={styles.textTemperature}>Lugar</Text>
        <Text style={styles.textTemperature}>Temperatura</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    setDefautlCityName(locationData);
    const defaultCityName = getDefaultCityName();
    appRender = (
      <View style={styles.container}>
        <Text style={styles.title}>Previsão do tempo</Text>
        <Text style={styles.textTemperature}>{defaultCityName}</Text>
        <Text style={styles.textTemperature}>Temperatura</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  return appRender;
}

async function setDefautlCityName(locationData) {
  const { latitude, longitude } = locationData.coords;
  console.log("Localizacao", latitude, longitude);
  const data = await fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=ae920a5b06307a00f99754fb6aedf942`
  );
  const responseData = await data.json();
  const cityName = responseData[0].name;
  localStorage.setItem("defaultCityName", cityName);
  console.log(localStorage.getItem("defaultCityName"));
}
function getDefaultCityName() {
  return localStorage.getItem("defaultCityName");
}
function getLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
