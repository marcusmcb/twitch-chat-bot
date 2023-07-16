const dotenv = require("dotenv");
dotenv.config();

const [ autoCommandList ] = require("../autocommand-list/autoCommandList");
const { commandList } = require("../command-list/commandList");

const autoCommandsConfig = (client, obs) => {
  const channel = `#${process.env.TWITCH_CHANNEL_NAME}`;
  let tags, args;
  let commandIndex = 0;

  if (process.env.DISPLAY_INTERVAL_MESSAGES === "true") {
    setInterval(() => {
      let command = autoCommandList[commandIndex];
      if (command in commandList) {
        commandList[command](channel, tags, args, client, obs);
      } else {
        console.log(`Command ${command} is not in the command list.`);
      }
      commandIndex++;
      // If we've gone past the end of the command list, loop back to the start
      if (commandIndex >= autoCommandList.length) {
        commandIndex = 0;
      }
    }, 5000);
  } else {
    console.log("No interval messages in this stream");
  }
};

module.exports = autoCommandsConfig;
