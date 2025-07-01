/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.submitKundli = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  const googleScriptUrl = "https://script.google.com/macros/s/AKfycbwiaCZeVbDtFuyTWF9RZ7c1RXvOpc3-hICPsF_VxJ-6KTNhwmPOtJIrwBG06N6idYgZqg/exec";

  try {
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const result = await response.text();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Something went wrong.");
  }
});
