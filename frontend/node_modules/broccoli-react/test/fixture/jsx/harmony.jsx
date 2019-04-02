/*jslint indent: 2, node: true, nomen: true, browser: true*/
/*global React */
'use strict';
var { bar, baz } = require('../js/foo');
module.exports = React.createClass({
  render: function () {
    return (
      <h1>Output</h1>
    );
  }
});
