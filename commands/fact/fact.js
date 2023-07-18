const axios = require("axios");

const factCommand = async (channel, tags, args, client) => {
  let randomFact;
  let options = {
    url: "https://uselessfacts.jsph.pl/random.json?language=en",
    headers: { Accept: "application/json" },
  };

  try {
    const response = await axios(options);
    if (response.status === 200) {
      randomFact = response.data;
      client.say(channel, `Random fact: ${randomFact.text}`);
    } else {
      client.say(
        channel,
        "Hmmm... looks like that's not working right now. 💀"
      );
    }
  } catch (error) {
    client.say(channel, "Hmmm... looks like that's not working right now. 💀");
  }
};

module.exports = {
  factCommand: factCommand,
};
