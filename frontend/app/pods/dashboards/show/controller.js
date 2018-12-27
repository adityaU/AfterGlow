import Ember from 'ember';

import DynamicQueryParamsControllerMixin from 'frontend/mixins/dynamic-query-params-controller-mixin';
export default Ember.Controller.extend(DynamicQueryParamsControllerMixin, {
    dashboard: Ember.computed.alias('model'),

    queryParamsVariables: Ember.computed.alias('dashboard.variables'),

    variablesFulfilled: Ember.computed('dashboard.questions.@each.variablesUpdated', function () {
        let variablesFulfilled = true;
        this.get('dashboard.questions').forEach((item) => {
            item.get('variables').forEach((variable) => {
                if (!variable.get('isLoaded')) {
                    variablesFulfilled = false;
                }
            });
        });
        return variablesFulfilled;
    }),

    reloadBasedOnQueryParamsObserver: Ember.observer('reloadBasedOnQueryParams', 'variablesFulfilled', function () {
        let variablesFulfilled = this.get('variablesFulfilled');
        if (variablesFulfilled) {
            this.refreshFunction();
        }
    }),
    questionObserver: Ember.on('init', Ember.observer('dashboard', function () {
        let questions = this.get('dashboard.questions');
        if (questions) {
            let ids = questions.map(function (item) {
                return item.id;
            });
            this.store.query('question', {
                filter: {
                    id: ids.join(',')
                }
            });
        }
    })),
    nonEditable: 'yes',
    fullScreen: false,
    refreshIntervals: [{
        name: 'Never',
        value: null
    },
    {
        name: '5 Seconds',
        value: 5000
    },
    {
        name: '10 Seconds',
        value: 10000
    },
    {
        name: '30 Seconds',
        value: 30000
    },
    {
        name: '1 Minute',
        value: 60000
    },
    {
        name: '5 Minutes',
        value: 300000
    },
    {
        name: '15 Minutes',
        value: 900000
    },
    {
        name: '30 Minutes',
        value: 1800000
    },
    ],
    refreshInterval: {
        name: 'Never',
        value: null
    },
    schedule: function (f) {
        return Ember.run.later(this, function () {
            f.apply(this);
            this.set('timer', this.schedule(f));
        }, this.get('refreshInterval.value'));
    },

    editModeObserver: Ember.observer('editMode', function () {
        this.set('dashboard.isEditing', this.get('editMode'));
    }),
    stopTimer: function () {
        Ember.run.cancel(this.get('timer'));
    },

    startTimer: function () {
        this.refreshFunction();
        this.set('timer', this.schedule(this.get('onPoll')));
    },

    onPoll: function () {
        this.refreshFunction();
    },
    refreshIntervalObserver: Ember.observer('refreshInterval', function () {
        let refreshInterval = this.get('refreshInterval');
        if (refreshInterval.value != null) {
            this.stopTimer();
            this.startTimer();
        } else {
            this.stopTimer();
        }
    }),
    // setQuestionDashboardVariables() {
    //     let questions = this.get('dashboard.questions');
    //     questions && questions.forEach((item) => {
    //         let variable = item.get('variables').findBy('name', this.get('name'));
    //         variable && variable.set('value', this.get('value'));
    //         variable && variable.set('default_options', this.get('default_options'));
    //     });
    // },
    refreshFunction() {
        this.changeQueryParamsInUrl(this.get('dashboard.variables'), this.get('dashboard.title'));
        // this.setQuestionDashboardVariables();
        let questions = this.get('dashboard.questions');
        questions && questions.forEach((item) => {
            item.set('resultsCanBeLoaded', true);
            item.set('updated_at', new Date());
        });
    },
    editMode: Ember.computed.alias('dashboard.isEditing'),
    actions: {
        editDashboard() {
            this.set('nonEditable', null);
            this.set('editMode', true);
        },
        addNewNote() {
            let dashboard = this.get('dashboard');
            let note = this.store.createRecord('note', {
                dashboard: this.get('dashboard')
            });
            note.set('isEditing', true);
            dashboard.set('newNoteSettings', {
                width: 24,
                height: 14,
                noMove: true
            });
            dashboard.set('newNote', note);
            Ember.run.next(this, function () {
                Ember.$('.grid-stack').data('gridstack').disable();
            });
        },
        saveDashboard() {
            let dashboard = this.get('dashboard');
            let settings = {};
            dashboard.get('questions').forEach((item) => {
                let el = $('#js-question-' + item.get('id')).parents('.grid-stack-item');
                settings[item.get('id')] = {
                    x: el.data('gs-x'),
                    y: el.data('gs-y'),
                    width: el.data('gs-width'),
                    height: el.data('gs-height')
                    // noMove: this.get('nonEditable'),
                    // noResize: this.get('nonEditable')
                };
            });
            dashboard.set('settings', Ember.Object.create(settings));
            settings = {};
            dashboard.get('notes').forEach((item) => {
                let el = $('#js-notes-' + item.get('id')).parents('.grid-stack-item');

                settings[item.get('id')] = {
                    x: el.data('gs-x'),
                    y: el.data('gs-y'),
                    width: el.data('gs-width'),
                    height: el.data('gs-height')
                    // noMove: this.get('nonEditable'),
                    // noResize: this.get('nonEditable')
                };
            });
            dashboard.set('notes_settings', Ember.Object.create(settings));
            dashboard.save().then((response) => {
                dashboard.get('variables').invoke('save');
            }).then((variables) => {
                this.set('nonEditable', 'yes');
                this.set('editMode', false);
            });
        },
        cancelEditingDashboard() {
            this.set('nonEditable', 'yes');
            this.set('editMode', false);
        },
        showShareDialogue() {
            this.set('toggleShareModal', 'true');
        },
        showDeleteDialogue() {
            this.set('toggleDeleteDialogue', true);
            $('.ui.modal.delete-dialogue').modal('show');
        },
        deleteDashboard(dashboard) {
            dashboard.destroyRecord().then((response) => {
                this.transitionToRoute('index');
            });
        },
        setRefreshInterval(interval) {
            this.set('refreshInterval', interval);
        },
        refreshNow() {
            this.refreshFunction();
        },
        showVariablesDialogue() {
            $('.ui.modal.select-dashboard-variables').modal('show');
        },
        toggleFullScreen() {
            if (
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            ) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                this.set('fullScreen', false);
            } else {
                let element = Ember.$('.dashboard-page').get(0);
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
                this.set('fullScreen', true);
            }
        }
    }
});
