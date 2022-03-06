const axios = require('axios')

const ids = [1]

const turnLightOnOrOff = async (lightId, on, hue, sat, bri) => {
  try {
    return await axios.put(
      `http://${process.env.HUE_BRIDGE_ADDRESS}/api/${process.env.HUE_AUTH_USER}/lights/${lightId}/state`,
      {
        on,
        ...(sat && { sat }),
        ...(bri && { bri }),
        ...(hue && { hue }),
      }
    )
  } catch (err) {
    console.error(err)
  }
}

const turnLightsOnOrOff = async (on) => {
  ids.forEach((id) => turnLightOnOrOff(id, on))
}

const setLightsToRandomColors = async () => {
  ids.forEach((id) => {
    const hue = Math.floor(Math.random() * 65535) + 1
    console.log('HUE: ', hue)
    const sat = 200
    const bri = 200
    turnLightOnOrOff(id, true, hue, sat, bri)
  })
}

const setLightsToColor = async (color) => {
  let hueValue
  console.log('COLOR: ', color[0])
  // philips hue values for color command options
  // NOTE: use the console.log in the !random command to find values for color options
  if (color == 'teal') {
    hueValue = 31421
  }
  if (color == 'pink') {
    hueValue = 60364
  }
  if (color == 'green') {
    hueValue = 25000
  }
  if (color == 'purple') {
    hueValue = 47277
  }
  if (color == 'red') {
    hueValue = 65030
  }
  if (color == 'gold') {
    hueValue = 10500
  }
  if (color == 'blue') {
    hueValue = 42500
  }
  if (color == 'peach') {
    hueValue = 2409
  }

  ids.forEach((id) => {
    const hue = hueValue
    const sat = 200
    const bri = 200
    turnLightOnOrOff(id, true, hue, sat, bri)
  })
}

const setLightsForChristmas = () => {
  turnLightOnOrOff(ids[0], true, 27306, 150, 175)
  turnLightOnOrOff(ids[1], true, 1, 150, 175)
}

module.exports = {
  setLightsForChristmas,
  setLightsToRandomColors,
  turnLightsOnOrOff,
  setLightsToColor,
}
