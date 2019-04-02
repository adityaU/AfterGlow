'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _broccoliPlugin = require('broccoli-plugin');

var _broccoliPlugin2 = _interopRequireDefault(_broccoliPlugin);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _heimdalljsLogger = require('heimdalljs-logger');

var _heimdalljsLogger2 = _interopRequireDefault(_heimdalljsLogger);

var _heimdalljs = require('heimdalljs');

var _heimdalljs2 = _interopRequireDefault(_heimdalljs);

var _outputPatcher = require('./output-patcher');

var _outputPatcher2 = _interopRequireDefault(_outputPatcher);

var _fsTreeDiff = require('fs-tree-diff');

var _fsTreeDiff2 = _interopRequireDefault(_fsTreeDiff);

var _fs = require('fs');

var _os = require('os');

var _walkSync = require('walk-sync');

var _symlinkOrCopy = require('symlink-or-copy');

var _nodeModulesPath = require('node-modules-path');

var _nodeModulesPath2 = _interopRequireDefault(_nodeModulesPath);

// rollup requires this, so old version of node need it

require('es6-map/implement');

var logger = (0, _heimdalljsLogger2['default'])('broccoli-rollup');

function deref(srcPath, destPath) {
  var content = (0, _fs.readFileSync)(srcPath);
  (0, _fs.writeFileSync)(destPath, content);
}

var Rollup = (function (_Plugin) {
  _inherits(Rollup, _Plugin);

  function Rollup(node) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Rollup);

    _get(Object.getPrototypeOf(Rollup.prototype), 'constructor', this).call(this, [node], {
      name: options && options.name,
      annotation: options && options.annotation,
      persistentOutput: true
    });
    this.rollupOptions = options.rollup || {};
    this._lastBundle = null;
    this._output = null;
    this.lastTree = _fsTreeDiff2['default'].fromEntries([]);
    this.linkedModules = false;
    this.cache = options.cache === undefined ? true : options.cache;

    if ('nodeModulesPath' in options && !_path2['default'].isAbsolute(options.nodeModulesPath)) {
      throw new Error('nodeModulesPath must be fully qualified and you passed a relative path');
    }

    this.nodeModulesPath = options.nodeModulesPath || (0, _nodeModulesPath2['default'])(process.cwd());
  }

  // for old node

  _createClass(Rollup, [{
    key: 'build',
    value: function build() {
      var _this = this;

      var lastTree = this.lastTree;
      var linkedModules = this.linkedModules;

      if (!linkedModules) {
        (0, _symlinkOrCopy.sync)(this.nodeModulesPath, this.cachePath + '/node_modules');
        this.linkedModules = true;
      }

      var newTree = this.lastTree = _fsTreeDiff2['default'].fromEntries((0, _walkSync.entries)(this.inputPaths[0]));
      var patches = lastTree.calculatePatch(newTree);

      patches.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var op = _ref2[0];
        var relativePath = _ref2[1];

        switch (op) {
          case 'mkdir':
            (0, _fs.mkdirSync)(_this.cachePath + '/' + relativePath);
            break;
          case 'unlink':
            (0, _fs.unlinkSync)(_this.cachePath + '/' + relativePath);
            break;
          case 'rmdir':
            (0, _fs.rmdirSync)(_this.cachePath + '/' + relativePath);
            break;
          case 'create':
            deref(_this.inputPaths[0] + '/' + relativePath, _this.cachePath + '/' + relativePath);
            break;
          case 'change':
            deref(_this.inputPaths[0] + '/' + relativePath, _this.cachePath + '/' + relativePath);
            break;
        }
      });

      // If this a noop post initial build, just bail out
      if (this._lastBundle && patches.length === 0) {
        return;
      }

      var options = this._loadOptions();
      options.entry = this.cachePath + '/' + options.entry;
      return _heimdalljs2['default'].node('rollup', function () {
        return require('rollup').rollup(options).then(function (bundle) {
          if (_this.cache) {
            _this._lastBundle = bundle;
          }
          _this._buildTargets(bundle, options);
        });
      });
    }
  }, {
    key: '_loadOptions',
    value: function _loadOptions() {
      // TODO: support rollup config files
      var options = assign({
        cache: this._lastBundle
      }, this.rollupOptions);
      return options;
    }
  }, {
    key: '_targetsFor',
    value: function _targetsFor(options) {
      if (options.dest) {
        return [options];
      }
      if (options.targets) {
        return options.targets.map(function (target) {
          return assign({}, options, target);
        });
      }
      throw new Error('missing targets or dest in options');
    }
  }, {
    key: '_buildTargets',
    value: function _buildTargets(bundle, options) {
      var _this2 = this;

      var output = this._getOutput();
      this._targetsFor(options).forEach(function (options) {
        _this2._buildTarget(bundle, options, output);
      });
      output.patch();
    }
  }, {
    key: '_buildTarget',
    value: function _buildTarget(bundle, options, output) {
      var dest = options.dest;
      var sourceMap = options.sourceMap;
      var sourceMapFile = options.sourceMapFile;

      // ensures "file" entry and relative "sources" entries
      // are correct in the source map.
      if (sourceMapFile) {
        options.sourceMapFile = this.cachePath + '/' + sourceMapFile;
      } else {
        options.sourceMapFile = this.cachePath + '/' + dest;
      }

      var _bundle$generate = bundle.generate(options);

      var code = _bundle$generate.code;
      var map = _bundle$generate.map;

      if (sourceMap) {
        var url = undefined;
        if (sourceMap === 'inline') {
          url = map.toUrl();
        } else {
          url = this._addSourceMap(map, dest, output);
        }
        code += '\n//# sourceMap';
        code += 'pingURL=' + url + '\n';
      }
      output.add(dest, code);
    }
  }, {
    key: '_addSourceMap',
    value: function _addSourceMap(map, relativePath, output) {
      var url = _path2['default'].basename(relativePath) + '.map';
      output.add(relativePath + '.map', map.toString());
      return url;
    }
  }, {
    key: '_getOutput',
    value: function _getOutput() {
      var output = this._output;
      if (!output) {
        output = this._output = new _outputPatcher2['default'](this.outputPath, logger);
      }
      return output;
    }
  }]);

  return Rollup;
})(_broccoliPlugin2['default']);

exports['default'] = Rollup;
function assign(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    var keys = Object.keys(source);
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      target[key] = source[key];
    }
  }
  return target;
}
module.exports = exports['default'];