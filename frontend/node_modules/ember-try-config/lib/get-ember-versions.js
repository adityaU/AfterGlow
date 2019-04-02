'use strict';

var array = require('lodash/array');
var RSVP = require('rsvp');

var sortVersions = require('./sort-versions');
var fetchEmberVersionsFromGithub = require('./fetch-ember-versions-from-github');

module.exports = function getEmberVersions() {
  var fetchVersionsPromise;
  if (arguments[0]) {
    fetchVersionsPromise = RSVP.resolve(arguments[0]);
  } else {
    fetchVersionsPromise = fetchEmberVersionsFromGithub();
  }
  return fetchVersionsPromise.then(function(versions) {
    return sortVersions(array.uniq([].concat(versionsFromBower(), versions)));
  });
};

// jscs:disable
function versionsFromBower() {
  return require('./known-ember-versions');
}
// jscs:enable
