const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const config = require("./config.json");

const app = express();
app.use(bodyParser.json());

let ACCESSTOKEN;

// Utility function to convert date to int
const getIntFromDateTime = (dt) => Math.floor(dt.getTime() / 1000);

async function generateJWT() {
  try {
    const message = {
      iss: config.client_id,
      sub: config.client_id,
      aud: config.token_url,
      // jti: "f9eaafba-2e49-11ea-8880-5ce0c5aee671",
      jti: crypto.randomBytes(32).toString("hex"),
      iat: getIntFromDateTime(new Date()),
      exp: getIntFromDateTime(new Date(Date.now() + 5 * 60000)), // 5 minutes later
    };

    console.log(message);

    // Load an RSA key from a PEM file
    const signingKey = fs.readFileSync("./privatekey.pem", {
      encoding: "utf8",
    });

    // fs.readFile("./privatekey.pem", "ascii", function (pemContents) {
    //   // do whatever you want here
    //   console.log(pemContents);
    // });

    // Encode the JWT
    const compactJws = jwt.sign(message, signingKey, { algorithm: "RS384" });
    console.log(compactJws);

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/"
    };

    const data = new URLSearchParams({
      grant_type: "client_credentials",
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: compactJws,
    });

    const response = await axios.post(
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
      data,
      { headers }
    );
    console.log(response.data);
    return response.data.access_token;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  generateJWT().then(res => {
    ACCESSTOKEN = res;
    if (ACCESSTOKEN) console.log(ACCESSTOKEN);
  });
});
