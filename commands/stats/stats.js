const createLiveReport = require("./createLiveReport");

const dotenv = require("dotenv");

dotenv.config();

const statsCommand = async (channel, tags, args, client, obs, url) => {
  try {
    const reportData = await createLiveReport(url);
    const currentAverageTrackLength = reportData.average_track_length    

    if (reportData.total_tracks_played === 0) {
      client.say(
        channel,
        "Sorry, no playlist stats for this stream at the moment."
      );
    } else {
      client.say(
        channel,
        `${tags.username} has played ${reportData.total_tracks_played} songs so far in this set with an average length of ${currentAverageTrackLength} per song.`
      );

      obs.call("SetInputSettings", {
        inputName: "obs-chat-response",
        inputSettings: {
          text: `${tags.username} has played ${reportData.total_tracks_played} songs so far\nin this stream at an average of ${currentAverageTrackLength} per song.`,
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
  } catch (err) {
    console.log(err);
    client.say(channel, "That doesn't appear to be working right now.");
  }
};

module.exports = {
  statsCommand: statsCommand,
};
