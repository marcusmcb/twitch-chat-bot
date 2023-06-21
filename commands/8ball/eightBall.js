const eightBallMessages = require('./eightBallMessages')

const eightballCommand = (channel, tags, args, client) => {
  // check if user entered anything after the command
  if (args.length != 0) {
    var random_key = Math.floor(Math.random() * 19 - 0) + 0
    client.say(
      channel,
      `@${tags.username}, ${eightBallMessages[random_key]}`
    )
  } else {
    // if not, prompt the user to try again
    client.say(
      channel,
      `@${tags.username}, what'cha wanna know? Ask a question after the command! 🎱`
    )
  }
}

module.exports = {
  eightballCommand: eightballCommand
}