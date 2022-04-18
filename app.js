require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const ejs = require('ejs');
const units = require(__dirname + '/units');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const apiKey = process.env.WEATHER_API_KEY;
const weatherDataObject = {
  city: '',
  units: '',
  weatherData: '',
  temperature: '',
  humidity: '',
  weatherIcon: '',
  imgUrl: '',
}

// Want to be able to render the index.html whenever the user calls the app.get function at the root route
app.get('/', (req, res) => {
  res.render('index');
})

// Catch the data being sent by the index.html
app.post('/', (req, res) => {
  weatherDataObject.city = req.body.cityName;
  weatherDataObject.units = req.body.unitsInput;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${weatherDataObject.city}&apiKey=${apiKey}&units=${weatherDataObject.units}`

  
  // The response data returned from the API request
  https.get(url, (response) => {
    response.on('data', (data) => {
      weatherData = JSON.parse(data);
      console.log(weatherData.main)
      weatherDataObject.temperature = weatherData.main.temp;
      weatherDataObject.humidity = weatherData.main.humidity;
      weatherDataObject.weatherDescription = weatherData.weather[0].description;
      weatherDataObject.weatherIcon = weatherData.weather[0].icon;
      weatherDataObject.imgUrl = `http://openweathermap.org/img/wn/${weatherDataObject.weatherIcon}@2x.png`
    })
    res.redirect('/weather')
  })
  
  app.get('/weather', (req, res) => {
    let unitName = units.getUnit(weatherDataObject.units);
    
    res.render('weather', { 
      theCity: weatherDataObject.city, 
      theTemperature: weatherDataObject.temperature, 
      theHumidity: weatherDataObject.humidity, 
      theWeatherDescription: weatherDataObject.weatherDescription, 
      theImgUrl: weatherDataObject.imgUrl, 
      theUnits: unitName });
  })
})

app.listen(port, () => {
  console.log(`We are listening on port ${port} baby!`)
})