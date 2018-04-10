import DS from 'ember-data';

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
});
