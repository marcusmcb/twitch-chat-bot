const axios = require("axios");

const quoteCommand = async (channel, tags, args, client) => {
  let quoteOptions = {
    url: "https://zenquotes.io/api/random/",
    headers: { Accept: "application/json" },
  };

  try {
    const response = await axios(quoteOptions);
    if (response.status === 200) {
      let quote = response.data[0].q;
      let quoter = response.data[0].a;
      client.say(channel, `'${quote}' - ${quoter}`);
    } else {
      client.say(channel, "Looks like that command isn't working right now.");
    }
  } catch (error) {
    client.say(channel, "Looks like we are fresh out of quotes right now.");
  }
};

module.exports = {
  quoteCommand: quoteCommand,
};
