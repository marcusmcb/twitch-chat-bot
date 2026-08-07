const axios = require('axios')
const appConfig = require('../../config/appConfig')

const usStateCodes = new Set([
	'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
	'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
	'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
	'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
	'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
	'DC',
])

const canadaProvinceCodes = new Set([
	'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU',
	'ON', 'PE', 'QC', 'SK', 'YT',
])

const countryAliases = {
	US: 'US',
	USA: 'US',
	'UNITED STATES': 'US',
	'UNITED STATES OF AMERICA': 'US',
	CA: 'CA',
	CANADA: 'CA',
	GB: 'GB',
	UK: 'GB',
	'UNITED KINGDOM': 'GB',
	AU: 'AU',
	AUSTRALIA: 'AU',
	NZ: 'NZ',
	'NEW ZEALAND': 'NZ',
}

const imperialCountryCodes = new Set(['US', 'LR', 'MM'])

const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32
const metersPerSecondToMph = (metersPerSecond) => metersPerSecond * 2.2369362921
const metersPerSecondToKmh = (metersPerSecond) => metersPerSecond * 3.6

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

const normalizeLocationQuery = (rawLocation) => {
	const trimmedLocation = rawLocation.trim().replace(/\s+/g, ' ')
	const cityStateMatch = trimmedLocation.match(/^(.+?),\s*([A-Za-z]{2})$/)
	const locationParts = trimmedLocation.split(',').map((part) => part.trim())

	if (locationParts.length === 3) {
		const city = locationParts[0]
		const region = locationParts[1]
		const countryInput = locationParts[2].toUpperCase()
		const countryCode = countryAliases[countryInput] || countryInput

		if (countryCode.length === 2) {
			return `${city},${region},${countryCode}`
		}

		return trimmedLocation
	}

	if (!cityStateMatch) {
		return trimmedLocation
	}

	const city = cityStateMatch[1].trim()
	const regionCode = cityStateMatch[2].toUpperCase()

	if (usStateCodes.has(regionCode)) {
		return `${city},${regionCode},US`
	}

	if (canadaProvinceCodes.has(regionCode)) {
		return `${city},${regionCode},CA`
	}

	return trimmedLocation
}

const weatherCommand = async (channel, tags, args, client) => {
	// check if user entered location
	if (args.length != 0) {
		let weather, userLocation, conditions
		const userLocationInput = args.join(' ')
		userLocation = normalizeLocationQuery(userLocationInput)
		let weatherOptions = {
			url: `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(userLocation)}&units=metric&appid=${appConfig.openWeather.apiKey}`,
			headers: { Accept: 'application/json' },
		}
		try {
			const response = await axios(weatherOptions)
			if (response.status === 200) {
				weather = response.data
				conditions = weather.weather[0].main
				const countryCode = (weather.sys?.country || '').toUpperCase()
				const isImperial = imperialCountryCodes.has(countryCode)
				const baseTempCelsius = weather.main.temp
				const baseWindMetersPerSecond = weather.wind.speed

				const temperatureCelsius = getTemperature(baseTempCelsius)
				const temperatureFahrenheit = getTemperature(
					celsiusToFahrenheit(baseTempCelsius),
				)
				const windValue = isImperial
					? metersPerSecondToMph(baseWindMetersPerSecond)
					: metersPerSecondToKmh(baseWindMetersPerSecond)

				const windSpeed = windValue.toFixed()
				const windUnit = isImperial ? 'mph' : 'km/h'
				const locationLabel = weather.name
					? `${weather.name}${countryCode ? `, ${countryCode}` : ''}`
					: userLocation

				client.say(
					channel,
					`Right now in ${locationLabel}: ${conditions.toLowerCase()} with a temperature of ${temperatureCelsius}C/${temperatureFahrenheit}F and ${
						weather.main.humidity
					}% humidity with winds at ${windSpeed} ${windUnit}.`
				)
			} else {
				client.say(channel, "Looks like that command isn't working right now.")
			}
		} catch (error) {
			console.log(error)
			client.say(channel, "Apparently... the weather is broken right now.")
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
