'use strict';

var expect = require('chai').expect;
var helpers = require('broccoli-test-helper');
var createBuilder = helpers.createBuilder;
var createTempDir = helpers.createTempDir;
var UnwatchedTree = require("./index");

describe("broccoli-unwatched-tree", function() {
  var input;
  var output;
  var subject;

  beforeEach(function(done) {
    createTempDir()
      .then(function(dir) {
        input = dir;
        done();
      });
  });

  afterEach(function(done) {
    input.dispose()
      .then(function() {
        return output.dispose();
      })
      .then(function() {
        done();
      });
  });

  it("work when invoked without new", function(done) {
    input.write({
      "lib": {
        "a.js": `export class A {};`,
        "b.js": `export class B {};`,
        "c.js": `export class C {};`
      }
    });

    subject = UnwatchedTree(input.path());
    output = createBuilder(subject);

    output.build()
      .then(function() {
        expect(
          output.read()
        ).to.deep.equal({
          "lib": {
            "a.js": `export class A {};`,
            "b.js": `export class B {};`,
            "c.js": `export class C {};`
          }
        });

        done();
      });
  });

  it("work when invoked with new", function(done) {
    input.write({
      "lib": {
        "a.js": `export class A {};`,
        "b.js": `export class B {};`,
        "c.js": `export class C {};`
      }
    });

    subject = new UnwatchedTree(input.path());
    output = createBuilder(subject);

    output.build()
      .then(function() {
        expect(
          output.read()
        ).to.deep.equal({
          "lib": {
            "a.js": `export class A {};`,
            "b.js": `export class B {};`,
            "c.js": `export class C {};`
          }
        });

        done();
      });
  });
});
