import Ember from 'ember';
import { Ability } from 'ember-can';

export default Ability.extend({
    sessionService: Ember.inject.service(),
    canShow: Ember.computed('sessionService.permissions', function() {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Settings.all') >= 0);
    })

});
