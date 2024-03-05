const axios = require('axios')

// helper method to parse pre-decimal value
// from temperature response returned

const getTemperature = (temperature) => {  
	const temperatureStr = temperature.toString()
	const decimalIndex = temperatureStr.indexOf('.')
	if (decimalIndex === -1) {
		return temperatureStr
	}
	return temperatureStr.substring(0, decimalIndex)
}

const weatherCommand = async (channel, tags, args, client) => {
	// check if user entered location
	if (args.length != 0) {
		let weather, userLocation, conditions, temperature, windSpeed
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
		try {
			const response = await axios(weatherOptions)
			if (response.status === 200) {
				weather = response.data
				conditions = weather.weather[0].main
				temperature = getTemperature(weather.main.temp)
				windSpeed = weather.wind.speed.toFixed()

				client.say(
					channel,
					`Right now in ${userLocation}: ${conditions.toLowerCase()} with a temperature of ${temperature}F and ${
						weather.main.humidity
					}% humidity with winds at ${windSpeed} mph.`
				)
			} else {
				client.say(channel, "Looks like that command isn't working right now.")
			}
		} catch (error) {
			console.log(error)
			client.say(channel, "Looks like that command isn't working right now.")
		}
	} else {
		// ...prompt user to add their location
		client.say(
			channel,
			`@${tags.username}, add your location after the command to get your weather!`
		)
	}
}

module.exports = {
	weatherCommand: weatherCommand,
}
