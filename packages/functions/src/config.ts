import * as fbAdmin from "firebase-admin";

let _admin;

if (process.env.FUNCTIONS_EMULATOR)
  _admin = fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(require("../.serviceacc.json")),
  });
else _admin = fbAdmin.initializeApp();

export const admin = _admin;
