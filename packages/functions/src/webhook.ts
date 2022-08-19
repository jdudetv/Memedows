import bodyParser from "body-parser";
import express from "express";
import * as fbAdmin from "firebase-admin";
import * as functions from "firebase-functions";
import { EventPayloadMap, TwitchEvents } from "@memedows/types";

import { admin } from "./config";

const firestore = admin.firestore();

const app = express();

app.use(
  bodyParser
    .json
    // {
    //     verify: function(req: any, res, buf, encoding) {
    //         // is there a hub to verify against
    //         req.twitch_hub = false;
    //         console.log(req.headers)
    //         if (req.headers && req.headers.hasOwnProperty('twitch-eventsub-message-signature')) {
    //             req.twitch_hub = true;

    // id for dedupe
    // var id = req.headers['twitch-eventsub-message-id'];
    // check age
    // var timestamp = req.headers['twitch-eventsub-message-timestamp'];

    // var xHub = req.headers['twitch-eventsub-message-signature'].split('=');

    // you could do
    // req.twitch_hex = crypto.createHmac(xHub[0], config.hook_secret)
    // but we know Twitch always uses sha256
    // req.twitch_hex = crypto.createHmac('sha256', config.hook_secret)
    //     .update(id + timestamp + buf)
    //     .digest('hex');
    // req.twitch_signature = xHub[1];

    // if (req.twitch_signature != req.twitch_hex) {
    //     console.error('Signature Mismatch');
    // } else {
    //     console.log('Signature OK');
    // }
    //         }
    //     }
    // }
    ()
);

app.post("/", (req, res) => {
  // console.log("WHAT");
  // if (req.twitch_hub) {
  // is it a verification request
  if (
    req.headers["twitch-eventsub-message-type"] ==
    "webhook_callback_verification"
  ) {
    // it's a another check for if it's a challenge request
    if (req.body.hasOwnProperty("challenge")) {
      // we can validate the signature here so we'll do that
      // if (req.twitch_hex == req.twitch_signature) {
      console.log("Got a challenge, return the challenge");
      res.send(encodeURIComponent(req.body.challenge));
      return;
      // }
    }
    // unexpected hook request
    res.status(403).send("Denied");
  } else if (req.headers["twitch-eventsub-message-type"] == "revocation") {
    // the webhook was revoked
    // you should probably do something more useful here
    // than this example does
    res.send("Ok");
  } else if (req.headers["twitch-eventsub-message-type"] == "notification") {
    const data = req.body as {
      event: any;
      subscription: { type: keyof TwitchEvents.EventSubTypeMap };
    };

    let formattedData = data.event;

    const formatterFn = dataFormatters[data.subscription.type];
    if (formatterFn !== undefined) formattedData = formatterFn(formattedData);

    firestore.collection("events").add({
      type: subscriptionToNameMap[data.subscription.type],
      payload: formattedData,
      timestamp: fbAdmin.firestore.FieldValue.serverTimestamp(),
    });
    // if (req.twitch_hex == req.twitch_signature) {
    console.log("The signature matched");
    // the signature passed so it should be a valid payload from Twitch
    // we ok as quickly as possible
    res.send("Ok");
    // } else {
    // console.log('The Signature did not match');
    // the signature was invalid
    // res.send('Ok');
    // we'll ok for now but there are other options
    // }
  } else {
    console.log("Invalid hook sent to me");
    // probably should error here as an invalid hook payload
    res.send("Ok");
  }
  // } else {
  // console.log('It didn\'t seem to be a Twitch Hook');
  // again, not normally called
  // but dump out a OK
  // res.send('Ok');
  // }
});

export const webhookApi = functions
  .region("australia-southeast1")
  .https.onRequest(app);

const dataFormatters: {
  [T in keyof TwitchEvents.EventSubTypeMap]: (
    event: any
  ) => TwitchEvents.EventSubTypeMap[T];
} = {
  "channel.follow": (e) => ({
    userId: e.user_id,
    userName: e.user_name,
    followedAt: e.followed_at,
  }),
  "channel.subscription.end": (e) => ({
    userId: e.user_id,
    userName: e.user_name,
  }),
  "channel.cheer": (e) => ({
    message: e.message,
    bits: e.bits,
    anonymous: e.is_anonymous,
    userId: e.user_id,
    userName: e.user_name,
  }),
  "channel.raid": (e) => ({
    fromId: e.from_broadcaster_user_id,
    fromName: e.from_broadcaster_user_name,
    viewers: e.viewers,
  }),
  "channel.hype_train.begin": (e) => ({
    total: e.total,
    progress: e.progress,
    goal: e.goal,
  }),
  "channel.hype_train.progress": (e) => ({
    level: e.level,
    total: e.total,
    progress: e.progress,
    goal: e.goal,
    top_contributions: e.top_contributions,
    last_contribution: e.last_contribution,
  }),
  "channel.hype_train.end": (e) => ({
    level: e.level,
    total: e.total,
    cooldownEndsAt: e.cooldown_ends_at,
    top_contributions: e.top_contributions,
  }),
  "stream.online": (e) => ({ startedAt: e.started_at }),
  "stream.offline": (_) => ({}),
  "channel.poll.begin": (e) => ({
    id: e.id,
    title: e.title,
    choices: e.choices,
    channelPointsVoting: {
      enabled: e.channel_points_voting.is_enabled,
      amountPerVote: e.channel_points_voting.amount_per_vote,
    },
    bitsVoting: {
      enabled: e.bits_voting.is_enabled,
      amountPerVote: e.bits_voting.amount_per_vote,
    },
    startedAt: e.started_at,
    endsAt: e.ends_at,
  }),
  "channel.poll.progress": (e) => ({
    id: e.id,
    title: e.title,
    choices: e.choices.map((choice: any) => ({
      id: choice.id,
      title: choice.title,
      bitsVotes: choice.bits_votes,
      channelPointsVotes: choice.channel_points_votes,
      votes: choice.votes,
    })),
    channelPointsVoting: {
      enabled: e.channel_points_voting.is_enabled,
      amountPerVote: e.channel_points_voting.amount_per_vote,
    },
    bitsVoting: {
      enabled: e.bits_voting.is_enabled,
      amountPerVote: e.bits_voting.amount_per_vote,
    },
    startedAt: e.started_at,
    endsAt: e.ends_at,
  }),
  "channel.poll.end": (e) => ({
    id: e.id,
    title: e.title,
    choices: e.choices.map((choice: any) => ({
      id: choice.id,
      title: choice.title,
      bitsVotes: choice.bits_votes,
      channelPointsVotes: choice.channel_points_votes,
      votes: choice.votes,
    })),
    channelPointsVoting: {
      enabled: e.channel_points_voting.is_enabled,
      amountPerVote: e.channel_points_voting.amount_per_vote,
    },
    bitsVoting: {
      enabled: e.bits_voting.is_enabled,
      amountPerVote: e.bits_voting.amount_per_vote,
    },
    status: "completed",
    startedAt: e.started_at,
    endsAt: e.ended_at,
  }),
  "channel.prediction.begin": (e) => ({
    id: e.id,
    title: e.title,
    outcomes: e.outcomes,
    startedAt: e.started_at,
    locksAt: e.locks_at,
  }),
  "channel.prediction.progress": (e) => ({
    id: e.id,
    title: e.title,
    startedAt: e.started_at,
    locksAt: e.locks_at,
    outcomes: e.outcomes.map((o: any) => ({
      id: o.id,
      title: o.title,
      color: o.color,
      users: o.users,
      topPredictors: o.top_predictors.map((tp: any) => ({
        userName: tp.user_name,
        userId: tp.user_id,
        channelPointsUsed: tp.channel_points_used,
        channelPointsWon: null,
      })),
    })),
  }),
  "channel.prediction.lock": (e) => ({
    id: e.id,
    title: e.title,
    startedAt: e.started_at,
    locksAt: e.locks_at,
    outcomes: e.outcomes.map((o: any) => ({
      id: o.id,
      title: o.title,
      color: o.color,
      users: o.users,
      topPredictors: o.top_predictors.map((tp: any) => ({
        userName: tp.user_name,
        userId: tp.user_id,
        channelPointsUsed: tp.channel_points_used,
        channelPointsWon: null,
      })),
    })),
  }),
  "channel.prediction.end": (e) => ({
    id: e.id,
    title: e.title,
    startedAt: e.started_at,
    locksAt: e.locks_at,
    endedAt: e.ended_at,
    status: e.status,
    winningOutcomeId: e.winning_outcome_id,
    outcomes: e.outcomes.map((o: any) => ({
      id: o.id,
      title: o.title,
      color: o.color,
      users: o.users,
      topPredictors: o.top_predictors.map((tp: any) => ({
        userName: tp.user_name,
        userId: tp.user_id,
        channelPointsUsed: tp.channel_points_used,
        channelPointsWon: tp.channel_points_won,
      })),
    })),
  }),
  "channel.channel_points_custom_reward_redemption.add": (e) => ({
    id: e.id,
    userId: e.user_id,
    userName: e.user_name,
    input: e.user_input,
    status: "unfulfilled",
    reward: e.reward,
    redeemedAt: e.redeemed_at,
  }),
  "channel.channel_points_custom_reward_redemption.update": (e) => ({
    id: e.id,
    userId: e.user_id,
    userName: e.user_name,
    input: e.user_input,
    status: e.status,
    reward: e.reward,
    redeemedAt: e.redeemed_at,
  }),
  "channel.update": (e) => ({
    title: e.title,
    category: e.category_name,
  }),
  "channel.subscribe": (e) => ({
    userId: e.user_id,
    userName: e.user_name,
    gifted: e.is_gift,
    tier: SUB_TIER[e.tier],
  }),
  "channel.subscription.gift": (e) => ({
    userId: e.user_id,
    userName: e.user_name,
    tier: SUB_TIER[e.tier],
    total: e.total,
    cumulative: e.cumulative_total,
    anonymous: e.is_anonymous,
  }),
  "channel.subscription.message": (e) => ({
    userId: e.user_id,
    userName: e.user_name,
    tier: SUB_TIER[e.tier],
    streak: e.streak_months,
    cumulative: e.cumulative_months,
    duration: e.duration_months,
    message: e.message,
  }),
};

const SUB_TIER: any = {
  "1000": 1,
  "2000": 2,
  "3000": 3,
  prime: "prime",
};

const subscriptionToNameMap: Record<
  keyof TwitchEvents.EventSubTypeMap,
  keyof EventPayloadMap
> = {
  "channel.channel_points_custom_reward_redemption.add": "redemptionAdd",
  "channel.channel_points_custom_reward_redemption.update": "redemptionUpdate",
  "channel.cheer": "cheer",
  "channel.follow": "follow",
  "channel.hype_train.begin": "hypeTrainBegin",
  "channel.hype_train.end": "hypeTrainEnd",
  "channel.hype_train.progress": "hypeTrainProgress",
  "channel.poll.begin": "pollBegin",
  "channel.poll.progress": "pollProgress",
  "channel.poll.end": "pollEnd",
  "channel.prediction.begin": "predictionBegin",
  "channel.prediction.progress": "predictionProgress",
  "channel.prediction.end": "predictionEnd",
  "channel.prediction.lock": "predictionLock",
  "channel.subscribe": "subscribe",
  "channel.subscription.gift": "giftSubscribe",
  "channel.subscription.message": "subscriptionMessage",
  "channel.subscription.end": "subscriptionEnd",
  "channel.raid": "raid",
  "channel.update": "channelUpdate",
  "stream.offline": "streamOffline",
  "stream.online": "streamOnline",
};
