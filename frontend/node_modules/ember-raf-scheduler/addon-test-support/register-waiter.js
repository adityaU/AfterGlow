import scheduler from 'ember-raf-scheduler';

export default function registerWaiter() {
  // We can't rely on the importable Ember since shims are no
  // longer included by default, so use the global instance.
  // eslint-disable-next-line
  Ember.Test.registerWaiter(function() {
    return scheduler.jobs === 0;
  });
}
