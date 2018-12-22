import DS from 'ember-data';
import Ember from 'ember';
import {
    memberAction
} from 'ember-api-actions';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    columns: DS.attr(),
    question: DS.belongsTo('question'),
    snapshotData: DS.hasMany('snapshot_datum'),
    scheduled: DS.attr('boolean'),
    interval: DS.attr('number'),
    starting_at: DS.attr('date'),
    is_in_process: DS.attr('boolean'),
    should_save_data_to_db: DS.attr('boolean'),
    should_create_csv: DS.attr('boolean'),
    should_send_mail_on_completion: DS.attr('boolean'),
    searchable_columns: DS.attr('array'),
    keep_latest: DS.attr('number'),
    mail_to: DS.attr('array'),

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),

    stop: memberAction({
        path: 'stop',
        type: 'POST'
    }),

    stopAndNew: memberAction({
        path: 'stop_and_new',
        type: 'POST'
    }),


    subscribers: Ember.computed('mail_to', function () {
        return this.get('mail_to').join(',');
    })
});
