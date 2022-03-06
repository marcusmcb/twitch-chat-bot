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
    const sat = 200
    const bri = 175
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
}
