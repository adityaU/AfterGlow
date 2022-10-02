import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    onLoad() {

      // do whatever you want to calculate your values
      //
      // this.set('my-frame-with', "600px");
      iFrameResize({log: false, checkOrigin: false}, "#" + this.elementId + "> iframe")

    }
  }
});
