import DS from 'ember-data';
export default DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    created_at: DS.attr('date'),
    updated_at: DS.attr('date'),
    shareable_link: DS.attr('string'),
    is_shareable_link_public: DS.attr('boolean'),
    settings: DS.attr('object'),
    question_count: DS.attr('string'),
    questions: DS.hasMany("questions"),
    tags: DS.hasMany('tags')
});
