const rpsBotSelection = require('./rpsselector')

const rockCommand = (channel, tags, args, client) => {
  let rockResponse = rpsBotSelection()
  if (rockResponse === 'rock') {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} and MCB Chatbot both show ${rockResponse} 🤘. It's a tie!`
    )
  } else if (rockResponse === 'paper') {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} shows rock 🤘 but MCB Chatbot shows ${rockResponse} 🧻. @${tags.username} loses!`
    )
  } else {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} shows rock 🤘 and MCB Chatbot shows ${rockResponse} ✂. @${tags.username} wins! 🏆🏆🏆`
    )
  }
}

const paperCommand = (channel, tags, args, client) => {
  let paperResponse = rpsBotSelection()
  if (paperResponse === 'paper') {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} and MCB Chatbot both show ${paperResponse} 🧻. It's a tie!`
    )
  } else if (paperResponse === 'scissors') {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} shows paper 🧻 but MCB Chatbot shows ${paperResponse} ✂. @${tags.username} loses!`
    )
  } else {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} shows paper 🧻 and MCB Chatbot shows ${paperResponse} 🤘. @${tags.username} wins! 🏆🏆🏆`
    )
  }
}

const scissorsCommand = (channel, tags, args, client) => {
  let scissorsResponse = rpsBotSelection()
  if (scissorsResponse === 'scissors') {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} and MCB Chatbot both show ${scissorsResponse} ✂. It's a tie!`
    )
  } else if (scissorsResponse === 'rock') {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} shows scissors ✂ but MCB Chatbot shows ${scissorsResponse} 🤘. @${tags.username} loses!`
    )
  } else {
    client.say(
      channel,
      `Rock Paper Scissors! @${tags.username} shows scissors ✂ and MCB Chatbot shows ${scissorsResponse} 🧻. @${tags.username} wins! 🏆🏆🏆`
    )
  }
}

module.exports = {
  rockCommand: rockCommand,
  paperCommand: paperCommand,
  scissorsCommand: scissorsCommand
}