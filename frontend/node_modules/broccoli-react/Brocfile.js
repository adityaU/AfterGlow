'use strict';

function react() {
  var build = require('./index');

  return build('./test/fixture/', { extensions: ['js', 'jsx'] });
}

module.exports = react();
