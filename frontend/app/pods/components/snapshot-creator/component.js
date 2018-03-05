import Ember from 'ember';

export default Ember.Component.extend({
  toast: Ember.inject.service(),
  sessionService: Ember.inject.service(),

  snapshot: Ember.computed(function(){
    return {
      name: `${this.get('question.title')}-${moment().format('LLLL')}`,
      description: `Snapshot of ${this.get('question.title')} on ${moment().format('LLLL')}`,
      scheduled: false,
      interval: 86400,
      starting_at: new Date(),
      should_save_data_to_db: false,
      should_create_csv: true,
      should_send_mail_on_completion: true,
      mail_to: [this.get("sessionService.user.email")],
      question: this.get('question')
    }
  }),
  intervals: [
    {name: "2 hours", value: 7200},
    {name: "4 hours", value: 14400},
    {name: "6 hours", value: 21600},
    {name: "8 hours", value: 28800},
    {name: "12 hours", value: 43200},
    {name: "1 day", value: 86400},
    {name: "2 days", value: 172800},
    {name: "1 week", value: 604800},
    {name: "2 weeks", value: 1209600},
  ],

  intervalsReverseMapping: {
    7200: "2 hours",
    14400: "4 hours",
    21600: "6 hours",
    28800: "8 hours",
    43200: "12 hours",
    86400: "1 day",
    172800: "2 days",
    604800: "1 week",
    1209600: "2 weeks"
  },

  users: Ember.computed(function(){
    return this.get('store').findAll('user')
  }),
  actions:{
    createSnapshot(){
      let snapshot = this.store.createRecord('snapshot', this.get('snapshot'))
      snapshot.save().then((response)=> {
        this.get('toast').success(
          "Your snapshot is being created. You'll get an email when it is complete",
          'Yay!',
          {closeButton: true, timeout: 1500, progressBar:false}
        );
      })
    }
  }

});
