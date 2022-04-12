require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));

// Want to be able to render the index.html whenever the user calls the app.get function at the root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

// Catch the data being sent by the index.html
app.post('/', (req, res) => {
  const city = req.body.cityName;
  const units = req.body.unitsInput;
  const apiKey = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&apiKey=${apiKey}&units=${units}`

  https.get(url, (response) => {

    response.on('data', (data) => {
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const weatherDescription = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;
      const imgUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      let unitName = null;
      if (units === 'metric') {
        unitName = 'Celsius';
      } else {
        unitName = 'Farenheit';
      }

      // Send multiple lines of responses using multiple res.write, and then send the total using 1 res.send
      res.write(`<h1 style="color:maroon;text-align:center;">The temperature in ${city} is ${temperature} degrees ${unitName}, and the humidity is at ${humidity}.</h1>`)
      res.write(`<p style="text-align:center;">The weather currently includes a sky full of ${weatherDescription}.</p>`)
      res.write(`<img style="padding:30px;background-color:#059F9A; display:block;margin:0 auto;" src=${imgUrl} alt="weather icon">`)
      res.send()
    })
  })

})


app.listen(port, () => {
  console.log(`We are listening on port ${port} baby!`)
})