# ember-string-ishtmlsafe-polyfill

This provides a polyfill for the `Ember.String.isHTMLSafe` feature that has landed in ember/master. It is likely to ship with Ember 2.8 or 2.9.

RFC: [emberjs/rfcs#139](https://github.com/emberjs/rfcs/pull/139).

PR: [emberjs/ember.js#13666](https://github.com/emberjs/ember.js/pull/13666).


## Installation

```
ember install ember-string-ishtmlsafe-polyfill
```


## Usage
```javascript
import isHTMLSafe from 'ember-string-ishtmlsafe-polyfill';

export default Ember.Service.extend({
  someMethod(str) {
    if (isHTMLSafe(str)) {
      str = str.toString();
    }
    // Do something with native string
  }
});
```


## Compatibility

This addon is tested against each minor ember version starting with 1.10 through 2.5. Additionally tested against,
`ember-stable`, `ember-beta`, and `ember-canary`. A complete list can be found in the [`ember-try.js](https://github.com/workmanw/ember-string-ishtmlsafe-polyfill/blob/master/config/ember-try.js) config.


## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`
