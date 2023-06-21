// dependencies
const tmi = require('tmi.js')
const dotenv = require('dotenv')
const commandList = require('./command-list/commandList')

dotenv.config()

// // global vars to track and prevent command spamming
// let lastCommand
// let lastUser
// let commandCount = 0

// create tmi instance
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: [process.env.TWITCH_CHANNEL_NAME],
})

client.connect()

// chat command listener
client.on('message', (channel, tags, message, self) => {
  console.log('MESSAGE: ', message)
  if (self || !message.startsWith('!')) {
    return
  }

  const args = message.slice(1).split(' ')
  const command = args.shift().toLowerCase()  

  if (command in commandList) {
    commandList[command](channel, tags, args, client)
  }  

  // user is limited to 6 consecutive uses of each command
  // beyond that cap, user is prompted to use another command
  // const rateLimited = () => {
  //   client.say(
  //     channel,
  //     `${tags.username}, try a different command before using that one again.`
  //   )
  // }  

  // check if command is in list
  // if (commandList.includes(command)) {
  //   // check if the same user has entered the same command consecutively more than once
  //   if (lastCommand == command && lastUser == tags.username) {
  //     console.log(true)
  //     commandCount++
  //     console.log('COMMAND COUNT: ', commandCount)
  //     // redirect user to another command on rate limit
  //     if (commandCount === 6) {
  //       rateLimited()
  //       // ignore further commands from user if spamming
  //     } else if (commandCount > 6) {
  //       return
  //       // run command otherwise
  //     } else {
  //       runCommand(command)
  //     }
  //     // if not, call method/function that runs switch selector, set vars and counter
  //   } else {
  //     console.log(false)
  //     lastCommand = command
  //     lastUser = tags.username
  //     commandCount = 1
  //     runCommand(command)
  //   }
  // } else {
  //   // if command is not in list, reset count and return w/o response
  //   // we only want this script to listen for commands within the commandList
  //   // prevents response and rate-limiting conflicts w/other bots configured for the same channel
  //   commandCount = 0
  //   // reset args
  //   return
  // }
})

// add additional 8-ball responses

// replace request with another npm method per request's discontinuation
// refactor code to helper method for each api fetch case

// * rpi4 performance?

// add command to check to see if another streamer is currently live (common question)
// move !np options to start of logic switch (returning error w/o a live playlist currently)

// add function for bot to post specific commands at set intervals
// check "self" condition in message and add logic accordingly
