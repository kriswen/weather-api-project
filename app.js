import express from "express";
import https from "https"; // native node module
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(bodyParser.urlencoded({ extended: true })); //let our app to use body-parser

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// to catch form post request
app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const units = "imperial";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    units;

  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      //console.log(data);
      const weatherData = JSON.parse(data); //turn into javascript object
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<p>The weather is currenty " + weatherDescription + "</p>");
      res.write(
        "<h1>The temperature in " + query + " is " + temp + " degree F.</h1>"
      );
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
