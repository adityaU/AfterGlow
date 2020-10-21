import DS from 'ember-data';
import {
  memberAction,
  collectionAction
} from 'ember-api-actions';

export default DS.Model.extend({
  question: DS.belongsTo('question'),
  top_level_question: DS.belongsTo('question'),
  url: DS.attr('string'),
  headers: DS.attr('key-value-array'),
  body: DS.attr('string'),
  method: DS.attr('string'),
  name: DS.attr('string'),
  column: DS.attr('string'),
  color: DS.attr('string'),
  open_in_new_tab: DS.attr('boolean'),
  response_settings: DS.attr('object'),
  inserted_at: DS.attr('utc'),
  updated_at: DS.attr('utc'),

  sendCall: memberAction({
    path: 'send_request',
    type: 'post',
    urlType: 'findRecord'
  }),

  preview: collectionAction({
    path: 'send_request',
    type: 'post',
    urlType: 'findRecord'
  })
});
