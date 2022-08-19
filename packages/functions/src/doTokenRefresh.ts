import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

export const scheduledTokenRefresh = functions
  .region("australia-southeast1")
  .pubsub.topic("token-refresh")
  .onPublish(async (_) => {
    const authData = (
      await admin.firestore().collection("private").doc("twitchApiAuth").get()
    ).data()!;

    const newAuthData = (
      await axios.post(
        "https://id.twitch.tv/oauth2/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: authData.refreshToken,
          client_id: functions.config().twitch.client_id,
          client_secret: functions.config().twitch.secret,
        })
      )
    ).data;

    await admin.firestore().collection("private").doc("twitchApiAuth").update({
      refreshToken: newAuthData.refresh_token,
      accessToken: newAuthData.access_token,
    });
  });
