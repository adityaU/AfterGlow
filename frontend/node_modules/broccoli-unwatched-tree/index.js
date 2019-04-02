// please use broccoli-source instead
var broccoliSource = require('broccoli-source');
var UnwatchedDir = broccoliSource.UnwatchedDir;

function UnwatchedTree(path, options){
  if (!(this instanceof UnwatchedTree)) { return new UnwatchedTree(path, options); }

  UnwatchedDir.call(this, path, options);
};
UnwatchedTree.prototype = Object.create(UnwatchedDir.prototype);
UnwatchedTree.prototype.constructor = UnwatchedTree;

module.exports = UnwatchedTree;
