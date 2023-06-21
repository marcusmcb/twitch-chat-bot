const rpsBotSelection = () => {
  const rpsOptions = ['rock', 'paper', 'scissors']
  let randomIndex = Math.floor(Math.random() * 2)
  let response = rpsOptions[randomIndex]
  return response
}

module.exports = rpsBotSelection
