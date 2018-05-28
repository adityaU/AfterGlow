import Ember from 'ember';

export default Ember.Component.extend({
    toast: Ember.inject.service(),
    sessionService: Ember.inject.service(),

    snapshot: Ember.computed(function () {
        return {
            name: `${this.get('question.title')}-${moment().format('LLLL')}`,
            description: `Snapshot of ${this.get('question.title')} on ${moment().format('LLLL')}`,
            scheduled: false,
            interval: 86400,
            starting_at: new Date(),
            should_save_data_to_db: false,
            should_create_csv: true,
            should_send_mail_on_completion: true,
            mail_to: [this.get('sessionService.user.email')],
            question: this.get('question')
        };
    }),
    intervals: [{
        name: '2 hours',
        value: 7200
    },
    {
        name: '4 hours',
        value: 14400
    },
    {
        name: '6 hours',
        value: 21600
    },
    {
        name: '8 hours',
        value: 28800
    },
    {
        name: '12 hours',
        value: 43200
    },
    {
        name: '1 day',
        value: 86400
    },
    {
        name: '2 days',
        value: 172800
    },
    {
        name: '1 week',
        value: 604800
    },
    {
        name: '2 weeks',
        value: 1209600
    },
    ],

    intervalsReverseMapping: {
        7200: '2 hours',
        14400: '4 hours',
        21600: '6 hours',
        28800: '8 hours',
        43200: '12 hours',
        86400: '1 day',
        172800: '2 days',
        604800: '1 week',
        1209600: '2 weeks'
    },

    users: Ember.computed(function () {
        return this.get('store').findAll('user');
    }),
    sortedUsers: Ember.computed('users.content.isLoaded', function () {
        return this.get('users').sortBy('label');
    }),
    selectedUsers: Ember.computed('snapshot.mail_to', function () {
        return this.get('snapshot.mail_to') && this.get('snapshot.mail_to').map(function (item) {
            return Ember.Object.create({
                title: item
            });
        }) || [];
    }),
    userEmails: Ember.computed('users', 'users.content.isLoaded', function () {
        return this.get('users').map(function (item) {

            return Ember.Object.create({
                title: item.get('email')
            });
        });
    }),
    actions: {

        clear() {
            this.set('open', false);
        },
        selectScheduleInterval(value) {
            this.set('snapshot.interval', value);
        },
        addToEmails(item) {
            this.set('snapshot.mail_to', item.map(function (it) {
                return it.title;
            }));
        },
        addNewEmail(text) {
            let newUser = Ember.Object.create({
                title: text
            });
            this.get('userEmails').addObject(newUser);
            this.get('selectedUsers').addObject(newUser);
            this.get('snapshot.mail_to').addObject(text);
        },
        createSnapshot() {
            this.set('open', false);
            let snapshot = this.store.createRecord('snapshot', this.get('snapshot'));
            snapshot.save().then((response) => {
                this.get('toast').success(
                    'Your snapshot is being created. You\'ll get an email when it is complete',
                    'Yay!', {
                        closeButton: true,
                        timeout: 1500,
                        progressBar: false
                    }
                );
            });
        }
    }

});
