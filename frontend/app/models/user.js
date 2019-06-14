import DS from 'ember-data';
import Ember from 'ember';
import {
    memberAction,
    collectionAction
} from 'ember-api-actions';

export default DS.Model.extend({
    full_name: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    email: DS.attr('string'),
    profile_pic: DS.attr('string'),
    questions: DS.hasMany('questions'),
    is_deactivated: DS.attr('boolean'),
    permission_sets: DS.hasMany('permission_sets'),
    teams: DS.hasMany('teams'),
    organization: DS.belongsTo('organization'),

    role: Ember.computed('permission_sets', function () {
        return this.get('permission_sets') && this.get('permission_sets').objectAt(0);
    }),

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),

    fullInfo: Ember.computed('full_name', 'email', function () {
        return `${this.get('full_name')} - ${this.get('email')}`;
    }),

    displayableFullName: Ember.computed('full_name', function () {
        return this.get('full_name') && this.get('full_name').trim();
    }),
    activate: memberAction({
        path: 'activate',
        type: 'post',
        urlType: 'findRecord'
    }),
    deactivate: memberAction({
        path: 'deactivate',
        type: 'post',
        urlType: 'findRecord'
    })
});
