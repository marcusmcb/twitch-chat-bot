const axios = require("axios");

const lottoCommand = async (channel, tags, args, client) => {
  const numberSet = new Set();
  while (numberSet.size < 6) {
    const randomNumber = Math.floor(Math.random() * 70) + 1;
    numberSet.add(randomNumber);
  }
  const lotteryNumbers = Array.from(numberSet).join(", ");
  client.say(channel, `${tags.username}, your lucky numbers are: ${lotteryNumbers}`);
};

module.exports = {
  lottoCommand: lottoCommand,
};
