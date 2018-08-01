# vault-integration-sample-app
A sample Node.js app that shows how to create a new Vault integration

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/vaultdairy/vault-integration-sample-app)

## Deploy Instructions
1. Click on the Deploy button above. You should be able to deploy the application to a personal Heroku account for free.
1. Navigate to https://admin.vaultdairy.com and create a new user, if you don't already have one.  If you already have one, login.
1. Create a new organization if you don't already have one, or if you want to keep this integration separate from your other organizations.
1. Click on "Integrations" and click "Create new Integration"
1. Populate the form with your integration's information.  For the logo, you can use ```{{HEROKU_URL}}/logo.jpg``` and for the callback_url you can use ```{{HEROKU_URL}}/callback```.  
1. Add a public key to the newly created integration.  There is a ```public.key``` file in this repo that can be used for testing.  It corresponds with the pre-populated PRIVATE_KEY in the Heroku environment.  
1. Go into Heroku or use the Heroku CLI to update the environment variables ```INTEGRATION_ID``` AND ```INTEGRATION_KEY_ID``` with the values of your newly created integration and integration key.

At this point, your integration should be fully configured.  To install the integration, login to https://admin.vaultdairy.com and install the application.  The callback will provide you the ```installation_id``` that you can then use to make changes to the user's information.  

## Generating your own keys
If you would like to generate your own public / private keys, simple run the following two commands:
```
ssh-keygen -t rsa -b 4096 -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```
