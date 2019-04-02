import Ember from 'ember';

function isHTMLSafePolyfill(str) {
  return str && typeof str.toHTML === 'function';
}

export default Ember.String.isHTMLSafe || isHTMLSafePolyfill;
