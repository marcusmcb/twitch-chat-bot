const dotenv = require('dotenv')
dotenv.config()

const token = process.env.TWITCH_OAUTH_TOKEN

const loadConfigurations = () => {
  return new Promise((resolve, reject) => {
    // check for token value in ENV file
    if (token && token !== undefined && token !== null) {
      resolve(token)
    } else {
      reject(new Error('No valid token value is defined.'))
    }
  })
}

module.exports = loadConfigurations