/*jslint indent: 2, node: true, nomen: true, browser: true*/
/*global it, after, describe */

'use strict';

var assert = require('assert');
var fs = require('fs');
var rimraf = require('rimraf');
var expectedOutput = fs.readFileSync('test/expected/test.js', 'utf8');

after(function () {
  rimraf.sync('test/temp/');
  rimraf.sync('tmp');
});

describe('File creation', function(){
  it('should compile .jsx files', function () {
    assert.equal(
      expectedOutput,
      fs.readFileSync('test/temp/jsx/test.js', 'utf8')
    );
  });

  it('should compile .js files', function () {
    assert.equal(
      expectedOutput,
      fs.readFileSync('test/temp/js/test-options.js', 'utf8')
    );
  });

  it('should pass transform options', function () {
    var harmonyTest = fs.readFileSync('test/expected/harmony.js', 'utf8');

    assert.equal(
      harmonyTest,
      fs.readFileSync('test/temp/jsx/harmony.js', 'utf8')
    );
  });
});
