const request = require("request");
require("dotenv").config();

const access_token_map_box = process.env.MAP_BOX;

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${access_token_map_box}&limit=1`;
  request({ url, json: true }, (error, response) => {
    const { message, features } = response.body;
    if (error) {
      const callError = {
        msg: `Unable to connect to map service!`,
        error: error,
      };
      callback(callError, undefined);
    } else if (message) {
      callback({ msg: message }, undefined);
    } else if (features.length === 0) {
      callback({ msg: `Not Found` }, undefined);
    } else {
      const { center, place_name } = features[0];
      callback(undefined, {
        latitude: center[1],
        longitude: center[0],
        location: place_name,
      });
    }
  });
};

module.exports = geocode;
