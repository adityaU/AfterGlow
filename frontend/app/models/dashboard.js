import DS from 'ember-data';
export default DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
    shareable_link: DS.attr('string'),
    is_shareable_link_public: DS.attr('boolean'),
    has_permission: DS.attr('boolean'),
    settings: DS.attr('object'),
    question_count: DS.attr('string'),
    questions: DS.hasMany("questions"),
    shared_to: DS.attr(),
    variables: DS.hasMany('variables'),
    tags: DS.hasMany('tags')
});
