import Ember from 'ember';
import { Ability } from 'ember-can';

export default Ability.extend({
    sessionService: Ember.inject.service(),
    canCreate: Ember.computed('sessionService.permissions', function () {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Question.create') >= 0);
    }),
    canEdit: Ember.computed('sessionService.permissions', function () {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Question.edit') >= 0);
    }),
    canShow: Ember.computed('sessionService.permissions', function () {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Question.show') >= 0);
    }),
    canDelete: Ember.computed('sessionService.permissions', function () {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Question.delete') >= 0);
    }),

    canDownload: Ember.computed('sessionService.permissions', function () {
        return (this.get('sessionService.permissions') && this.get('sessionService.permissions').indexOf('Download.enabled') >= 0);

    })

});
