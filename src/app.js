const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

//  Define paths for Express config
const publicDirectorPath = path.join(__dirname, "../public");
const viewDirectorPath = path.join(__dirname, "../templates/views");
const partialsDirectorPath = path.join(__dirname, "../templates/partials");

//  Setup handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewDirectorPath);
hbs.registerPartials(partialsDirectorPath);

//  Setup static directory to serve
app.use(express.static(publicDirectorPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Mohamed Elghandour",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Mohamed Elghandour",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Mohamed Elghandour",
  });
});

app.get("/weather", (request, response) => {
  const { address } = request.query;
  address
    ? geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return response.send({ error });
        }

        forecast({ latitude, longitude }, (forecastError, forecastResponse) => {
          if (forecastError) {
            return response.send({ error: forecastError });
          }

          response.send({ location, forecast: forecastResponse, address });
        });
      })
    : response.send({ error: "please provide an address" });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Mohamed Elghandour",
    errorMessage: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Mohamed Elghandour",
    errorMessage: "Page not found.",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port http://localhost:${port}/.`);
});

// app.get("/", (request, response) => {
//   response.send("<h1>Hello Express!</h1>");
// });

// app.get("/help", (request, response) => {
//   response.send([{ help: "--help" }]);
// });
// app.get("/about", (request, response) => {
//   response.send("<h1>About page</h1>");
// });
