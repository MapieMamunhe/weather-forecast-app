import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, TextInput } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "silver",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  textTemperature: {
    fontSize: 20,
    fontWeight: "200",
  },
  textInput: {
    borderColor: "black",
    fontSize: 20,
    width: 200,
    borderWidth: 1,
    margin: 5,
  },
  searchButton: {
    height: 20,
  },
});

const searchArea = (
  <View>
    <TextInput style={styles.textInput}></TextInput>
    <Button
      style={styles.searchButton}
      color="grey"
      title="Pesquisar Cidade"
      onPress={() => {}}
    ></Button>
  </View>
);

function temperatureViewArea(
  cityNameState,
  temperatureInFarhrenheit,
  temperatureInCelcius
) {
  let temperatureView = <Text style={styles.textTemperature}>Temperatura</Text>;

  //Verifica se fara uma renderizacao com dados completos ou nao
  if (cityNameState !== null && temperatureInFarhrenheit !== undefined) {
    temperatureView = getTemperatureView(
      temperatureInFarhrenheit,
      temperatureInCelcius
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão do tempo</Text>
      <Text style={styles.textTemperature}>
        {cityNameState === null ? "Localização não definida" : cityNameState}
      </Text>
      {temperatureView}
      {searchArea}
      <StatusBar style="auto" />
    </View>
  );
}
function getTemperatureView(temperatureInFarhrenheit, temperatureInCelcius) {
  const { temp, temp_min, temp_max } = temperatureInFarhrenheit;
  const { tempCelcius, temp_minCelcius, temp_maxCelcius } =
    temperatureInCelcius;
  const temperatureView = (
    <View>
      <Text style={styles.textTemperature}>
        Temperatura Actual: {temp}F || {tempCelcius} C
      </Text>
      <Text style={styles.textTemperature}>
        Temperatura Minima: {temp_min}F || {temp_minCelcius} C
      </Text>
      <Text style={styles.textTemperature}>
        Temperatura Max: {temp_max}F || {temp_maxCelcius} C
      </Text>
    </View>
  );
  return temperatureView;
}

export default temperatureViewArea;
