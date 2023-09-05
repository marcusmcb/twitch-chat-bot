const axios = require("axios");

const weatherCommand = async (channel, tags, args, client) => {
  // check if user entered location
  if (args.length != 0) {
    let weather, userLocation, conditions, temperature, windSpeed;
    // remove commas from parsed location
    if (args.length > 1) {
      userLocation = args.join(" ");
    } else {
      userLocation = args;
    }
    let weatherOptions = {
      url: `http://api.openweathermap.org/data/2.5/weather?q=${userLocation}&units=imperial&appid=${process.env.OPEN_WEATHER_API_KEY}`,
      headers: { Accept: "application/json" },
    };
    try {
      const response = await axios(weatherOptions);
      if (response.status === 200) {
        weather = response.data;        
        conditions = weather.weather[0].main;
        console.log("Conditions: ")
        console.log(weather)
        temperature = weather.main.temp.toString();
        temperature = temperature.substring(0, temperature.length - 3);
        windSpeed = weather.wind.speed.toFixed()
        console.log(windSpeed)
        client.say(
          channel,
          `Right now in ${userLocation}: ${conditions.toLowerCase()} with a temperature of ${temperature}F and ${
            weather.main.humidity
          }% humidity with winds at ${windSpeed} mph.`
        );
      } else {
        client.say(channel, "Looks like that command isn't working right now.");
      }
    } catch (error) {
      console.log(error);
      client.say(channel, "Looks like that command isn't working right now.");
    }
  } else {
    // ...prompt user to add their location
    client.say(
      channel,
      `@${tags.username}, add your location after the command to get your weather!`
    );
  }
};

module.exports = {
  weatherCommand: weatherCommand,
};
