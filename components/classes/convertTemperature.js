export default class ConvertTemperature {
  constructor() {}
  fahrenheitToCelcius(temperature) {
    let temperatureInCelcius = (temperature - 30) / 1.8;
    return temperatureInCelcius.toFixed(1);
  }
}
