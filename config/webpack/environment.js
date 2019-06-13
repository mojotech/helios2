const { environment } = require('@rails/webpacker');
const customConfig = require('./webpack.config.custom');

environment.config.merge(customConfig);
module.exports = environment;
