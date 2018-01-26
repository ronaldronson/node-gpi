const { promisify } = require('util');

const fs = require('fs');
const readline = require('readline');
const googleAuth = require('google-auth-library');
const { TOKEN_FILE } = require('./../../config/config.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + TOKEN_FILE;

const readFilePromise = promisify(fs.readFile);

module.exports = _ => readFilePromise('client_secret.json')
    .then(content => JSON.parse(content))
    .then(data => authorize(data));

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 */
function authorize({ installed }) {
  const auth = new googleAuth();

  const oauth2Client = new auth.OAuth2(
    installed.client_id,
    installed.client_secret,
    installed.redirect_uris[0]
  );

  return readFilePromise(TOKEN_PATH)
    .then(token => {
      oauth2Client.credentials = JSON.parse(token);
      return oauth2Client;
    })
    .catch(err => getNewToken(oauth2Client));
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 */
function getNewToken(oauth2Client) {
  var authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  console.log('Authorize this app by visiting this url: ', authUrl);

  var rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise(function(resolve, reject) {
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();

      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          reject(err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        resolve(oauth2Client);
      });
    });
  });

}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

