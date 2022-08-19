import bodyParser from "body-parser";
import express from "express";
import { admin } from "./config";
import * as fbAdmin from "firebase-admin";
import * as functions from "firebase-functions";

const firestore = admin.firestore();

const app = express();

app.use(bodyParser.json());

app.post("/", (req, res) => {
  firestore.collection("events").add({
    type: "Kofi",
    payload: JSON.parse(req.body.data),
    timestamp: fbAdmin.firestore.FieldValue.serverTimestamp(),
  });
  res.send("Ok");
});

export const kofiWebhook = functions
  .region("australia-southeast1")
  .https.onRequest(app);
