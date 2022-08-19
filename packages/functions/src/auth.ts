import crypto from "crypto";
import cookieParser from "cookie-parser";
import axios from "axios";
import cors from "cors";
import express from "express";
import * as functions from "firebase-functions";
import { NewUserData, UserData, UserSubStatus } from "@memedows/types";

import { admin } from "./config";
import * as fbAdmin from "firebase-admin";
import { firestore } from "firebase-admin";

var whitelist = ["http://localhost:3001", "https://memedo.ws"];

const callbackApp = express();

callbackApp.use(
  cors({
    origin: (origin, callback) => {
      if (origin && whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
callbackApp.use(cookieParser());

const subTiers: Record<string, number> = {
  "1000": 1,
  prime: 1,
  "2000": 2,
  "3000": 3,
};

callbackApp.get("/", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (
    !process.env.FUNCTIONS_EMULATOR &&
    (!state || state !== req.cookies.state)
  )
    throw "Error validating state";

  if (!code) throw "Code not supplied";

  const { data: twitchToken } = await axios.post(
    `https://id.twitch.tv/oauth2/token` +
      `?client_id=${functions.config().twitch.client_id}` +
      `&client_secret=${functions.config().twitch.secret}` +
      `&code=${code}` +
      `&grant_type=authorization_code` +
      `&redirect_uri=${
        process.env.FUNCTIONS_EMULATOR
          ? "http://localhost:3001/callback"
          : "https://memedo.ws/callback"
      }`
  );

  const {
    data: {
      data: [userData],
    },
  } = await axios.get("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${twitchToken.access_token}`,
      "Client-Id": functions.config().twitch.client_id,
    },
  });

  await admin
    .auth()
    .updateUser(userData.id, {
      displayName: userData.display_name,
      photoURL: userData.profile_image_url,
    })
    .then(() =>
      firestore()
        .collection("users")
        .doc(userData.id)
        .update({ displayName: userData.display_name })
    )
    .catch(async (e) => {
      if (e.code === "auth/user-not-found") {
        console.log("erroring");
        const firestoreData: NewUserData = {
          id: userData.id,
          displayName: userData.display_name,
          createdAt: fbAdmin.firestore.FieldValue.serverTimestamp() as any, // trust me fam
          following: false,
          subscription: UserSubStatus.NotSubbed,
        };

        const checkSubTier = async () => {
          try {
            const {
              data: { data },
            } = await axios.get(
              `https://api.twitch.tv/helix/subscriptions/user?user_id=${userData.id}&broadcaster_id=25118940`,
              {
                headers: {
                  Authorization: `Bearer ${twitchToken.access_token}`,
                  "Client-Id": functions.config().twitch.client_id,
                },
              }
            );

            console.log({ data });

            return data[0].tier;
          } catch {
            return;
          }
        };
        const checkIsFollower = async () => {
          const {
            data: {
              data: [followData],
            },
          } = await axios.get(
            `https://api.twitch.tv/helix/users/follows?from_id=${userData.id}&to_id=25118940`,
            {
              headers: {
                Authorization: `Bearer ${twitchToken.access_token}`,
                "Client-Id": functions.config().twitch.client_id,
              },
            }
          );

          return followData !== undefined;
        };

        const [subStatus, isFollower] = await Promise.all([
          checkSubTier(),
          checkIsFollower(),
        ]);

        if (subStatus !== undefined)
          firestoreData.subscription = subTiers[subStatus];

        firestoreData.following = isFollower;

        let tempUserData: UserData = {
          displayName: firestoreData.displayName,
          id: userData.id,
          xp: 0,
          votes: 0,
          jailVisits: 0,
          timeouts: 0,
          hasFollowed: isFollower || undefined,
          subscription: firestoreData.subscription,
        };

        await Promise.all([
          admin
            .firestore()
            .collection("new_users")
            .doc(userData.id)
            .set(firestoreData),
          admin
            .firestore()
            .collection("users")
            .doc(userData.id)
            .set(tempUserData),
          admin.auth().createUser({
            uid: userData.id,
            displayName: userData.display_name,
            photoURL: userData.profile_image_url,
          }),
        ]);
      }
    });

  res.send(await admin.auth().createCustomToken(userData.id));
});

export const callback = functions
  .region("australia-southeast1")
  .https.onRequest(callbackApp);

const redirectApp = express();

redirectApp.use(require("cors")());
redirectApp.use(cookieParser());

redirectApp.get("/", async (_, res) => {
  const state = crypto.randomBytes(20).toString("hex");

  res.cookie("state", state.toString(), {
    maxAge: 360000,
    secure: !process.env.FUNCTIONS_EMULATOR,
    httpOnly: true,
    sameSite: "none",
  });

  const redirectURI =
    `https://id.twitch.tv/oauth2/authorize` +
    `?client_id=${functions.config().twitch.client_id}` +
    `&redirect_uri=${
      process.env.FUNCTIONS_EMULATOR
        ? "http://localhost:3001/callback"
        : "https://memedo.ws/callback"
    }` +
    `&response_type=code&scope=user:read:email user:read:subscriptions channel:read:subscriptions user_subscriptions` +
    `&state=${state}` +
    `&force_verify=true`;

  res.redirect(redirectURI);
});

export const redirect = functions
  .region("australia-southeast1")
  .https.onRequest(redirectApp);
