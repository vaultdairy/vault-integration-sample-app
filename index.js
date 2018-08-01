const express = require('express');
const app = express();
const rp = require('request-promise');
const jwt = require('jsonwebtoken');

const HOST = process.env.HOST || 'http://localhost';
const PORT = process.env.PORT || 5000;

//
//  Handle the callback from Vault after a user signed up for your integration
//  Here, you'll likely want to confirm the user's identity and then establish a mapping between the Vault data and your data.
//
app.get('/callback', async (req, res) => {

    //
    //  Decode the installation JWT.  
    //  In production, you would want to verify the JWT's signature.
    // 
    var installation = jwt.decode(req.query.installation);

    let integration_id = installation.payload.audience;
    let installation_id = installation.payload.sub;
    let organization_id = installation.payload.organization_id;
    let user_id = installation.payload.user_id;


    let status;

    if(organization_id){
        status = `Organization ${organization_id} subscribed via Installation ID ${installation_id}.`;
    } else {
        status = `User ${user_id} subscribed via Installation ID ${installation_id}.`;
    }

    res.status(200).send(status);
});


//
//  An endpoint that allows submitting data to the API as the integration
//  In production, this functionality would likely be triggered by an event in your system or a cron job.
//
app.post('/send_data/:installation_id', async (req, res) => {

    // 
    //  Fetch private key from the environment.
    //  In production, this should be stored more securely.
    //
    var private_key = process.env.PRIVATE_KEY;

    //
    //  Create token for fetching an access token
    //
    let integrationToken = jwt.sign({ 
      kid: process.env.INTEGRATION_KEY_ID, // The key used to sign this request. 
      sub: process.env.INTEGRATION_ID, // The integration's id
      exp: Date.now() + 60,
      iat: Date.now(),
    } , private_key, { algorithm: 'RS256'});
 
    const vaultHost = process.env.VAULT_HOST || 'https://api.vaultdairy.com';

    //
    //  Get access token to get use with the Vault API
    //
    let access_token = await rp({
      method: 'POST',
      uri: vaultHost + '/installations/' + req.query.installation_id + '/access_tokens',
      headers: {
        'Authorization': 'Bearer ' + integrationToken
      },
      json: true // Automatically parses the JSON string in the response
    });

    let request_body = req.body;
    let vaultURL = request_body.url;
    delete request_body.url;

    // 
    //  Pass the data to Vault on behalf of the integration
    //  This test function only supports posting data
    //  For a full list of possible functions, please see https://api.vaultdairy.com/docs
    //
    let vault_request = await rp({
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken.access_token
        },
        uri: vaultURL,
        body: request_body,
        json: true 
      });

    res.json(vault_request);
});

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Listening on ${HOST}:${PORT}`));