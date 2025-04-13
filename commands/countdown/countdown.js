const countdownCommand = (channel, tags, args, client) => {
  if (args.length === 0) {
    for (let i = 10; i > 0; i--) {
      setTimeout(() => {
        client.say(channel, `${i}...`)
      }, (10 - i) * 1000)
    }    
  } else if (parseInt(args[0]) < 31) {
    for (let i = parseInt(args[0]); i > 0; i--) {
      setTimeout(() => {
        client.say(channel, `${i}...`)
      }, (parseInt(args[0]) - i) * 1000)
    }
  } else {
    client.say(channel, `I get winded after 30 seconds. Try a lower number.`) 
  } 
}

module.exports = { countdownCommand }