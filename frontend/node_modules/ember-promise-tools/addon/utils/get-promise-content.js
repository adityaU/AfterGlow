import Ember from 'ember';

// It's assumed if you call this method, it was previously checked that it was a promise
// and is fulfilled
export default function(promise) {
  if (Ember.PromiseProxyMixin.detect(promise)) {
    return promise.get('content');
  }

  if (promise instanceof Ember.RSVP.Promise) {
    return promise._result;
  }

  // Only can get the content for one of the two above
  return null;
}