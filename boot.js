const loadConfigurations = require('./config')
const initializeBot = require('./index')

loadConfigurations().then((config) => {
  console.log("CONFIG? ", config)
  setTimeout(() => {
    initializeBot(config)
  }, 1000)
}).catch((err) => {
  console.log('Error loading configuration: ', err)
})

