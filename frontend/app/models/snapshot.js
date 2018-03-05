import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    columns: DS.attr(),
    question: DS.belongsTo('question'),
    snapshotData: DS.hasMany('snapshot_datum'),
    scheduled: DS.attr("boolean"),
    interval: DS.attr("number"),
    starting_at: DS.attr("date"),
    is_in_process: DS.attr("boolean"),
    should_save_data_to_db: DS.attr("boolean"),
    should_create_csv: DS.attr("boolean"),
    should_send_mail_on_completion: DS.attr("boolean"),
    mail_to: DS.attr('array'),

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
});
