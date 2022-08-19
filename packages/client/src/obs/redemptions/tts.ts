// import Polly from "polly-tts";
import { GenericSound } from ".";
import { v4 as uuidv4 } from "uuid";
import process from "process";
import { asset, wait } from "~/utils";
import * as fs from "fs/promises";
import fs2 from "fs";
import util from "util";
import path from "path";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const options = {
  keyFilename: "L:/credentials.json",
};
const client = new TextToSpeechClient(options);

export async function TTSFunction(text: string, voice?: boolean) {
  let finalVoiceList = [];
  let voices = await client.listVoices();
  let voiceobject = voices[0].voices;
  for (let [index, voices] of Object.entries(voiceobject)) {
    if (voice) {
      if (voices.name?.includes("en") && voices.name?.includes("Standard"))
        finalVoiceList.push(voices);
    } else {
      if (voices.name?.includes("Standard")) finalVoiceList.push(voices);
    }
  }
  let chosenVoice =
    finalVoiceList[Math.round(Math.random() * finalVoiceList.length)];
  console.log(chosenVoice.name);

  let emoji = EmojiDetector(text);
  if (emoji && voice !== true) {
    text = text.substring(0, 50);
  } else {
    text = text.substring(0, 500);
  }

  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: chosenVoice.languageCodes,
      ssmlGender: "NEUTRAL",
      name: chosenVoice.name,
    },
    // select the type of audio encoding
    audioConfig: {
      audioEncoding: "MP3",
      pitch: voice ? 0 : Math.random() * 20 - 10,
      speakingRate: voice ? 1.2 : Math.random() + 0.75,
    },
  } as any;
  const fileNameTTS = "polly-tts" + uuidv4() + ".mp3";
  const [response]: any = await client.synthesizeSpeech(request);
  await fs.writeFile(
    `L:/Streaming/assets/tts/` + fileNameTTS,
    response.audioContent,
    "binary"
  );
  await GenericSound(
    "tts",
    `L:/Streaming/assets/tts/` + fileNameTTS,
    -30,
    true,
    10
  ).then(async () => {
    await wait(1000);
    await fs.unlink(`L:/Streaming/assets/tts/` + fileNameTTS);
  });
}

function EmojiDetector(string: string) {
  let regex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return regex.test(string);
}

// let polly = new Polly({
//   accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
//   secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
// });

// const ttsVoice = [
//   { name: "Emma", isNeural: "neural" },
//   { name: "Brian", isNeural: "neural" },
//   { name: "Joey", isNeural: "neural" },
//   { name: "Justin", isNeural: "neural" },
//   { name: "Kimberly", isNeural: "neural" },
//   { name: "Mathieu", isNeural: "standard" },
//   { name: "Vicki", isNeural: "standard" },
//   { name: "Karl", isNeural: "standard" },
//   { name: "Bianca", isNeural: "standard" },
//   { name: "Giorgio", isNeural: "standard" },
//   { name: "Karl", isNeural: "standard" },
//   { name: "Mizuki", isNeural: "standard" },
//   { name: "Takumi", isNeural: "standard" },
//   { name: "Seoyeon", isNeural: "standard" },
//   { name: "Liv", isNeural: "standard" },
//   { name: "Maja", isNeural: "standard" },
//   { name: "Jacek", isNeural: "standard" },
//   { name: "Camila", isNeural: "neural" },
//   { name: "Tatyana", isNeural: "standard" },
//   { name: "Maxim", isNeural: "standard" },
//   { name: "Conchita", isNeural: "standard" },
//   { name: "Enrique", isNeural: "standard" },
//   { name: "Miguel", isNeural: "standard" },
//   { name: "Astrid", isNeural: "standard" },
//   { name: "Gwyneth", isNeural: "standard" },
//   { name: "Filiz", isNeural: "standard" },
// ];

// const ttsFolder = path.join(process.cwd(), "temp", "tts");
// fs2.mkdirSync(ttsFolder, { recursive: true });

// export async function tts(text: string, voiceName: string) {
//   let voice = ttsVoice[3];

//   if (voiceName.toLowerCase() == "random") {
//     voice = ttsVoice[randomVoiceNum];
//   } else {
//     const vv = ttsVoice.find((v) => v.name === voiceName);
//     if (vv) {
//       voice = vv;
//     }
//   }

//   let options = {
//     text: text,
//     voiceId: voice.name,
//     region: "ap-southeast-2", //sydney server
//     engine: voice.isNeural,
//   };
//   await polly.textToSpeech(options, async (err: any, audioStream: any) => {
//     if (err) {
//       console.log(err.message);
//     }
//     const filePath = path.join(ttsFolder, fileNameTTS);
//     let fileStream = fs2.createWriteStream(filePath);
//     await audioStream.pipe(fileStream);
//     fileStream.on("finish", async function () {
//       await GenericSound("tts", filePath).then(async () => {
//         await wait(1000);
//         await fs.unlink(filePath);

//       });
//     });
//   });
// }

// let options2 = {
//     text: "Thankyou Jay dude, so were getting reports " + messageForTTS + " ,This has been " + message.userName + " Back to you jay dude.",
//     voiceId: ttsVoice[randomVoice].name,
//     region: "ap-southeast-2",
//     engine: ttsVoice[randomVoice].isNeural,
// };
// console.log(options2);
// polly.textToSpeech( options2, ( err, audioStream ) => {
//     if( err ) {
//         console.log(err.message);
//     }
//     let fileStream = fs.createWriteStream(fileNameTTS);
//     audioStream.pipe(fileStream);
//     fileStream.on('finish', function(){
