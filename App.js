import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
//Para pegar a localizacao do dispositivo
import * as Location from "expo-location";
//Para guardar Itens na memoria
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function App() {
  const [cityNameState, setCityName] = useState("Localização não definida");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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

  if (locationData === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Previsão do tempo</Text>
        <Text>{cityNameState}</Text>
        <Text style={styles.textTemperature}>Temperatura</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  let appRender;
  (async function setDefautlCityName(locationData) {
    const { latitude, longitude } = locationData.coords;
    const data = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=ae920a5b06307a00f99754fb6aedf942`
    );
    const responseData = await data.json();
    const cityName = responseData[0].name;
    setCityName(cityName);
  })(locationData);
  appRender = (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão do tempo</Text>
      <Text>{cityNameState}</Text>
      <Text style={styles.textTemperature}>Temperatura</Text>
      <StatusBar style="auto" />
    </View>
  );
  return appRender;
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
