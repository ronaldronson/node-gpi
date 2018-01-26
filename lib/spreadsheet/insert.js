const { promisify } = require('util');

const google = require('googleapis');
const doAuth = require('./auth');

const { spreadsheetId, spreadsheetTab } = require('./../../config/config.json');

const range = `${spreadsheetTab}!A1:A`;
const valueInputOption = 'USER_ENTERED';
const responseValueRenderOption = 'UNFORMATTED_VALUE';
const majorDimension = "ROWS";

module.exports = (values) => doAuth().then(auth => {
    const sheets = google.sheets('v4');
    const appendSpreadsheets = promisify(sheets.spreadsheets.values.append);

    return appendSpreadsheets({
        auth, spreadsheetId, range,
        valueInputOption, responseValueRenderOption,
        resource: { range, majorDimension, "values": [ values ] }
    });
});
