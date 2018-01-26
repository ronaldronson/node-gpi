const pagespeed = require('gpagespeed')

const { PAGESPEED_KEY: key } = require('./../config/config.json');

const strategy = url => !!~url.indexOf('~m') ? 'mobile' : 'desktop';

const getPagePromise = url => pagespeed({ key, url, strategy: strategy(url) })
    .then(data => data.ruleGroups.SPEED.score)
    .catch((error) => { console.error(error) });

module.exports = (urls) => Promise.all(urls.map(getPagePromise));
