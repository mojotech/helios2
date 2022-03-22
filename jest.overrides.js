const util = require('util');
global.console.error = (message, ...rest) => {
  throw Error(util.format(message, ...rest));
};
