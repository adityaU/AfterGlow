import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    full_name: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    email: DS.attr('string'),
    profile_pic: DS.attr('string'),
    questions: DS.hasMany('questions'),
    permission_sets: DS.hasMany('permission_sets'),

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),

    fullInfo: Ember.computed('full_name', 'email', function(){
        return `${this.get('full_name')} - ${this.get('email')}`;
    })
});
