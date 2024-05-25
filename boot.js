const loadConfigurations = require('./config')
const initializeBot = require('./index')

// run token check and then init chatbot script
loadConfigurations().then((config) => {  
  setTimeout(() => {
    initializeBot(config)
  }, 1000)
}).catch((err) => {
  console.log('Error loading configuration: ', err)
})

