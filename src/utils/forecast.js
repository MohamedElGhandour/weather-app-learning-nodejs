const request = require("request");
require("dotenv").config();

const access_token_WEATHER_API = process.env.WEATHER_API;

const weather = (geocode, callback) => {
  const { latitude, longitude } = geocode;
  const url = `http://api.weatherapi.com/v1/current.json?key=${access_token_WEATHER_API}&q=${latitude},${longitude}&aqi=yes`;
  request({ url, json: true }, (error, response) => {
    const { error: responseError, current } = response.body;
    if (error) {
      const callError = {
        msg: `Unable to connect to weather service!`,
        error: error,
      };
      callback(callError, undefined);
    } else if (responseError) {
      callback({ msg: responseError.message }, undefined);
    } else {
const {
        condition,
        temp_c,
        feelslike_c,
        wind_kph,
        pressure_mb,
        precip_mm,
      } = current;
      callback(
        undefined,
        `${condition.text}. It's currently ${temp_c} c degrees, It feels like ${feelslike_c} c degrees out, Wind Speed ${wind_kph} kmph, pressure ${pressure_mb} mb, Precipitation ${precip_mm} mm`
      );
    }
  });
};

module.exports = weather;
