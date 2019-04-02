import Ember from 'ember';
import config from '../config/environment';
import FromNowHelper from 'ember-moment/helpers/moment-from-now';

export default FromNowHelper.extend({
  globalAllowEmpty: !!Ember.get(config, 'moment.allowEmpty')
});
