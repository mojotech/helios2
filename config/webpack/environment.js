const { environment } = require('@rails/webpacker');
const svelte = require('./loaders/svelte')
const customConfig = require('./webpack.config.custom');

environment.config.merge(customConfig);
environment.loaders.prepend('svelte', svelte)
module.exports = environment;
