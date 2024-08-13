const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const config = require("./config.json");
const hostURL = config.host_url;
const patientList = require("./patients_list.json");
const testItemList = require("./test_items_list.json");
const endPoints = require("./endpoints.json");


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

    // Load an RSA key from a PEM file
    const signingKey = fs.readFileSync("./privatekey.pem", {
      encoding: "utf8",
    });

    // Encode the JWT
    const compactJws = jwt.sign(message, signingKey, { algorithm: "RS384" });

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

// Endpoint to handle /patients-list request
app.get('/patients-list', async (req, res) => {
  try {
    // Create an array to hold the patient data
    const patientData = [];

    // Loop through each patient in the patientList
    for (const patient of patientList) {
      const patientURL = `${hostURL}${endPoints["Patient.Read"]}${patient}`; // Construct the URL for each patient

      // Make a request to the FHIR API to get patient data
      const response = await axios.get(patientURL, {
        headers: {
          "Accept": "application/fhir+json",
          "Authorization": `Bearer ${ACCESSTOKEN}` // Use the token in the Authorization header
        }
      });

      // Push the patient data into the patientData array
      patientData.push(response.data);
    }

    // Respond with the patient data
    res.json(patientData);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch patient data' });
  }
});