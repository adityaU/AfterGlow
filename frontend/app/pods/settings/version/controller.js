import Ember from 'ember';
import ENV from '../../../config/environment'

export default Ember.Controller.extend({
    pageTitle: "Version",
    version: ENV.VERSION
});
