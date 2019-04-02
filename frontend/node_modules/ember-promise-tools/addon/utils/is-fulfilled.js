import Ember from 'ember';

// It's assumed if you call this method, it was previously checked that it is a promise
export default function(promise) {
  if (Ember.PromiseProxyMixin.detect(promise)) {
    if (promise.get('isFulfilled')) {
      return true;
    }

    return false;
  }

  if (promise instanceof Ember.RSVP.Promise) {
    if (promise._state === 1) { // Fulfilled
      return true;
    }
    return false;
  }

  // Can't detect it if its not one of the two kinds above
  return false;
}