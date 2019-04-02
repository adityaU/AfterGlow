'use strict';

var semver = require('semver');

module.exports = function sortVersions(versions) {
  return versions.sort(function(a, b) {
    var aValid = semver.valid(a);
    var bValid = semver.valid(b);

    if (aValid && bValid) {
      return -semver.compare(a, b);
    } else if (aValid) {
      return -1;
    } else if (bValid) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });
};
