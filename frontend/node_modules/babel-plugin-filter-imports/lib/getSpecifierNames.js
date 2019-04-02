'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getSpecifiersForRemoval = function getSpecifiersForRemoval(members, specifiers) {
  return _lodash2.default.transform(specifiers, function (result, specifier) {
    if (_lodash2.default.includes(members, '*')) {
      result.push.apply(result, _toConsumableArray(specifiers));
      return false;
    }

    if (t.isImportDefaultSpecifier(specifier) && _lodash2.default.includes(members, 'default')) {
      result.push(specifier);
    }

    if (_lodash2.default.includes(members, _lodash2.default.get(specifier, 'local.name'))) result.push(specifier);
  });
};

exports.default = getSpecifiersForRemoval;