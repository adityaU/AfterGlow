'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fsTreeDiff = require('fs-tree-diff');

var _fsTreeDiff2 = _interopRequireDefault(_fsTreeDiff);

var _md5Hex = require('md5-hex');

var _md5Hex2 = _interopRequireDefault(_md5Hex);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var OutputPatcher = (function () {
  function OutputPatcher(outputPath, logger) {
    _classCallCheck(this, OutputPatcher);

    this.outputPath = outputPath;
    this.entries = [];
    this.contents = Object.create(null);
    this.lastTree = _fsTreeDiff2['default'].fromEntries([]);
    this.isUnchanged = function (entryA, entryB) {
      if (entryA.isDirectory() && entryB.isDirectory()) {
        return true;
      }
      if (entryA.mode === entryB.mode && entryA.checksum === entryB.checksum) {
        logger.debug('cache hit, no change to: %s', entryA.relativePath);
        return true;
      }
      logger.debug('cache miss, write to: %s', entryA.relativePath);
      return false;
    };
  }

  // relativePath should be without leading '/' and use forward slashes

  _createClass(OutputPatcher, [{
    key: 'add',
    value: function add(relativePath, content) {
      this.entries.push(new Entry(relativePath, (0, _md5Hex2['default'])(content)));
      this.contents[relativePath] = content;
    }
  }, {
    key: 'patch',
    value: function patch() {
      try {
        this.lastTree = this._patch();
      } catch (e) {
        // next build just output everything
        this.lastTree = _fsTreeDiff2['default'].fromEntries([]);
        throw e;
      } finally {
        this.entries = [];
        this.contents = Object.create(null);
      }
    }
  }, {
    key: '_patch',
    value: function _patch() {
      var entries = this.entries;
      var lastTree = this.lastTree;
      var isUnchanged = this.isUnchanged;
      var outputPath = this.outputPath;
      var contents = this.contents;

      var nextTree = _fsTreeDiff2['default'].fromEntries(entries, {
        sortAndExpand: true
      });
      var patch = lastTree.calculatePatch(nextTree, isUnchanged);
      patch.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3);

        var op = _ref2[0];
        var path = _ref2[1];
        var entry = _ref2[2];

        switch (op) {
          case 'mkdir':
            _fsExtra2['default'].mkdirpSync(outputPath + '/' + path);
            break;
          case 'rmdir':
            _fsExtra2['default'].rmdirSync(outputPath + '/' + path);
            break;
          case 'unlink':
            _fsExtra2['default'].unlinkSync(outputPath + '/' + path);
            break;
          case 'create':
          case 'change':
            _fsExtra2['default'].writeFileSync(outputPath + '/' + path, contents[path]);
            break;
        }
      });
      return nextTree;
    }
  }]);

  return OutputPatcher;
})();

exports['default'] = OutputPatcher;

var Entry = (function () {
  function Entry(dest, checksum) {
    _classCallCheck(this, Entry);

    this.relativePath = dest;
    this.mode = 0;
    this.checksum = checksum;
  }

  _createClass(Entry, [{
    key: 'isDirectory',
    value: function isDirectory() {
      return false;
    }
  }]);

  return Entry;
})();

module.exports = exports['default'];