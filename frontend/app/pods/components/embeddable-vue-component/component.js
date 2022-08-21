import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    onLoad() {

      // do whatever you want to calculate your values
      //
      // this.set('my-frame-with', "600px");

      var _this = this
      window.addEventListener("message", function (event) {
        debugger
        if (event.data && event.data.event === 'ag_frontend_mounted') {
          var iframe = _this.$("iframe")
          iframe.height(event.data.height)
        }
      });
    }
  }
});
