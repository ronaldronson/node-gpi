const { promisify } = require('util');

const google = require('googleapis');
const doAuth = require('./auth');

const { spreadsheetId, spreadsheetTab } = require('./../../config/config.json');

const range = `${spreadsheetTab}!B1:Z1`;
const majorDimension = "COLUMNS";

module.exports = _ => doAuth().then(auth => {
    const sheets = google.sheets('v4');
    const getSpreadsheets = promisify(sheets.spreadsheets.values.get);

    return getSpreadsheets({ auth, spreadsheetId, range , majorDimension});
});
