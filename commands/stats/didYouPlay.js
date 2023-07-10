const dotenv = require("dotenv");

const createLiveReport = require("./createLiveReport");

dotenv.config();

const dypCommand = async (channel, tags, args, client, obs, url) => {
  let searchItem = args.join(" ");

  // check if user has entered a query value after the command
  if (args.length === 0) {
    client.say(
      channel,
      `Add an artist's name after the command to see if ${tags.username} has played them yet in this stream.`
    );
  } else {
    try {
      const reportData = await createLiveReport(url);
      let searchResults = [];
      let searchTerm = `${args}`.replaceAll(",", " ");
      for (let i = 0; i < reportData.track_array.length; i++) {
        if (
          reportData.track_array[i]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          searchResults.push(reportData.track_array[i]);
        }
      }

      // if query value is not present in search results...
      if (searchResults.length === 0) {
        client.say(
          channel,
          `${tags.username} has not played '${searchItem}' so far in this stream.`
        );
        obs.call("SetInputSettings", {
          inputName: "obs-chat-response",
          inputSettings: {
            text: `${tags.username} has not played\n'${searchItem}' so far in this stream.`,
          },
        });
        setTimeout(() => {
          obs.call("SetInputSettings", {
            inputName: "obs-chat-response",
            inputSettings: {
              text: "",
            },
          });
        }, 5000);
      } else {
        // find the last song played by the queried artist
        const lastSongPlayed = searchResults[searchResults.length - 1];

        if (searchResults.length === 1) {
          // add lastSongPlayed logic check here
          client.say(
            channel,
            `${tags.username} has played '${searchItem}' ${searchResults.length} time so far in this stream.`
          );
          obs.call("SetInputSettings", {
            inputName: "obs-chat-response",
            inputSettings: {
              text: `${tags.username} has played\n'${searchItem}' ${searchResults.length} time so far in this stream.\n\nThe last song played by ${searchTerm} was :\n${lastSongPlayed}`,
            },
          });
          setTimeout(() => {
            obs.call("SetInputSettings", {
              inputName: "obs-chat-response",
              inputSettings: {
                text: "",
              },
            });
          }, 5000);
        } else {
          client.say(
            channel,
            `${tags.username} has played '${searchItem}' ${searchResults.length} times so far in this stream.`
          );
          obs.call("SetInputSettings", {
            inputName: "obs-chat-response",
            inputSettings: {
              text: `${tags.username} has played\n'${searchItem}' ${searchResults.length} times so far in this stream.\n\nThe last ${searchTerm} song played was :\n${lastSongPlayed}`,
            },
          });
          setTimeout(() => {
            obs.call("SetInputSettings", {
              inputName: "obs-chat-response",
              inputSettings: {
                text: "",
              },
            });
          }, 5000);
        }
      }
    } catch (error) {
      console.log("HERE");
      console.log(error);
    }
  }
};

module.exports = {
  dypCommand: dypCommand,
};
