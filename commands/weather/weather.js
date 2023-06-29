const request = require('request')

const weatherCommand = (channel, tags, args, client) => {
  // check if user entered location
  if (args.length != 0) {
    let weather, userLocation, conditions, temperature
    // remove commas from parsed location
    if (args.length > 1) {
      userLocation = args.join(' ')
    } else {
      userLocation = args
    }
    let weatherOptions = {
      url: `http://api.openweathermap.org/data/2.5/weather?q=${userLocation}&units=imperial&appid=${process.env.OPEN_WEATHER_API_KEY}`,
      headers: { Accept: 'application/json' },
    }
    const weatherCallback = async (error, response, body) => {
      if (!error && response.statusCode == 200) {
        weather = await JSON.parse(body)
        conditions = weather.weather[0].main
        temperature = weather.main.temp.toString()
        temperature = temperature.substring(0, temperature.length - 3)
        client.say(
          channel,
          `Right now in ${userLocation}: ${conditions.toLowerCase()}, ${temperature}F with ${weather.main.humidity
          }% humidity`
        )
      } else {
        console.log(error)
        client.say(
          channel,
          "Looks like that command isn't working right now."
        )
      }
    }
    request(weatherOptions, weatherCallback)
  } else {
    // ...prompt user to add their location
    client.say(
      channel,
      `@${tags.username}, add your location after the command to get your weather!`
    )
  }
}

module.exports = {
  weatherCommand: weatherCommand
}