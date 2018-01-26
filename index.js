const getScoresByUrls  = require('./lib/pagespeed');
const getList = require('./lib/spreadsheet/list');
const insert = require('./lib/spreadsheet/insert');

const { getValues, log, addDate } = require('./lib/util');

getList()
    .then(getValues)
    // .then(log)
    .then(getScoresByUrls)
    .then(addDate)
    // .then(log)
    .then(insert)
    .catch(err => console.error(err));
