import { Ability } from 'ember-can';

export default Ability.extend({
    sessionService: Ember.inject.service(),
    canCreate: Ember.computed('sessionService.permissions', function() {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Dashboard.create') >= 0);
    }),
    canEdit: Ember.computed('sessionService.permissions', function() {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Dashboard.edit') >= 0);
    }),
    canShow: Ember.computed('sessionService.permissions', function() {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Dashboard.show') >= 0);
    }),
    canDelete: Ember.computed('sessionService.permissions', function() {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Dashboard.delete') >= 0);
    })

});
