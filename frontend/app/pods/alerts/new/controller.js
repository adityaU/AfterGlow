import Ember from 'ember';

export default Ember.Controller.extend({
  pageTitle: "New Alert",
  step: 1,
  errors: {},
  alert_setting: Ember.computed(function () {
    return this.store.createRecord("alert_setting", {
      name: null,
      question: null,
      aggregation: null,
      column: null,
      traversal: null,
      number_of_rows: 1,
      operation: null
    })
  }),
  criticalLevel: Ember.computed(function () {
    return this.store.createRecord('alert_level_setting', {
      value: null,
      level: "critical",
      allert_setting: this.get('alert_setting')
    })
  }),
  warningLevel: Ember.computed(function () {
    return this.store.createRecord('alert_level_setting', {
      value: null,
      level: "warning",
      allert_setting: this.get('alert_setting')
    })
  }),
  alertNotification: Ember.computed(function () {
    return this.store.createRecord('alert_notification_setting', {
      recipients: [],
      method: "email",
      allert_setting: this.get('alert_setting')
    })
  }),

  timeUnitMultiplier: {
    'minutes': 60,
    'hours': 3600,
    'days': 86400,
    'weeks': 604800
  },

  frequencyObserver: Ember.observer('timeInterval', 'timeUnit', function () {
    if (this.get('timeInterval') && this.get('timeUnit')) {
      this.set('alert_setting.frequency_value_in_seconds', this.get('timeInterval') * (this.get('timeUnitMultiplier')[this.get('timeUnit.value')]))
    }

  }),
  aggregations: [
    { value: "raw_value", title: "Raw Value" },
    { value: "average", title: "Average" },
    { value: "median", title: "Median" },
    { value: "min", title: "Min" },
    { value: "max", title: "Max" },
    { value: "sum", title: "Sum" },
    { value: "mean", title: "Mean" },
    { value: "percentile_90th", title: "90th percentile" },
    { value: "percentile_95th", title: "95th percentile" },
    { value: "percentile_99th", title: "99th percentile" }
  ],
  operations: [
    { value: "greater_than", title: "Greater than" },
    { value: "greater_than_equal_to", title: "Greater than or equal to" },
    { value: "less_than", title: "Less than" },
    { value: "less_than_equal_to", title: "Less than or equal to" },
    { value: "equal", title: "equal to" },
    { value: "not_equal_to", title: "Not equal to" }
  ],
  traversals: [
    { value: "any", title: "Any" },
    { value: "all", title: "All" },
    { value: "consecutive", title: "Consecutive" },
  ],
  timeUnits: [
    { title: "Minutes", value: "minutes" },
    { title: "Hours", value: "hours" },
    { title: "Days", value: "days" },
    { title: "Week", value: "week" },
  ],
  questions: Ember.computed(function () {
    return this.store.query('question', { with: 'columns' })
  }),
  columns: Ember.computed('alert_setting.question', function () {
    return this.get('alert_setting.question.columns') && this.get('alert_setting.question.columns').filter((item) => {
      return item
    }).map((item) => {
      return { title: item, value: item }
    })
  }),
  validateStep(currentStep) {
    if (currentStep == 1) {
      if (this.get('alert_setting.name')) {
        this.set("errors.name", false)
        return true
      } else {
        this.set("errors.name", true)
        return false
      }
    } else if (currentStep == 2) {
      if (this.get('alert_setting.question.id')) {
        this.set("errors.question", false)
        return true
      } else {
        this.set("errors.question", true)
        return false
      }

    } else if (currentStep == 3) {
      if (!this.get('alert_setting.aggregation')) {
        this.set("errors.aggregation", true)
      } else {
        this.set("errors.aggregation", false)
      }
      if (!this.get('alert_setting.column')) {
        this.set("errors.column", true)
      } else {
        this.set("errors.column", false)
      }

      if (!this.get('alert_setting.traversal')) {
        this.set("errors.traversal", true)
      } else {
        this.set("errors.traversal", false)
      }

      if (!this.get('alert_setting.number_of_rows')) {
        this.set("errors.number_of_rows", true)
      } else {
        this.set("errors.number_of_rows", false)
      }

      if (!this.get('alert_setting.operation')) {
        this.set("errors.operation", true)
      } else {
        this.set("errors.operation", false)
      }

      if (!this.get('warningLevel.value')) {
        this.set("errors.warningLevelValue", true)
      } else {
        this.set("errors.warningLevelValue", false)
      }

      if (!this.get('criticalLevel.value')) {
        this.set("errors.criticalLevelValue", true)
      } else {
        this.set("errors.criticalLevelValue", false)
      }


      if (this.get('errors.criticalLevelValue') ||
        this.get('errors.warningLevelValue') ||
        this.get('errors.aggregation') ||
        this.get('errors.column') ||
        this.get('errors.traversal') ||
        this.get('errors.number_of_rows') ||
        this.get('errors.operation')) {
        return false
      } else {
        return true
      }

    } else if (currentStep == 4) {
      if (!this.get('alertNotification.recipients')) {
        this.set('errors.notificationRecipients', true)
        return false
      } else if (this.get('alertNotification.recipients').length == 0) {
        this.set('errors.notificationRecipients', true)
        return false

      } else {
        this.set('errors.notificationRecipients', false)
        this.set('errors.notificationRecipients', false)
        return true
      }
    } else if (currentStep == 5) {
      if (!this.get('alert_setting.frequency_value_in_seconds')) {
        this.set('errors.frequency_value_in_seconds', true)
      } else {
        this.set("errors.frequency_value_in_seconds", false)
      }
      if (!this.get('alert_setting.start_time')) {
        this.set('errors.start_time', true)
      } else {
        this.set("errors.start_time", false)
      }

      if (this.get('errors.start_time') || this.get('errors.frequency_value_in_seconds')) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }

  },
  syncToServer(currentStep) {
    if (currentStep == 5) {
      this.get('alert_setting').save().then((response) => {

        this.set('warningLevel.alert_setting', response)
        this.get('warningLevel').save()
        this.set('criticalLevel.alert_setting', response)
        this.get('criticalLevel').save()
        this.set('alertNotification.alert_setting', response)
        this.get('alertNotification').save()
      })
    }
  },
  selectedRecipients: Ember.computed('alertNotification.recipients', function () {
    return this.get('alertNotification.recipients') && this.get('alertNotification.recipients').map(function (item) {
      return Ember.Object.create({
        title: item
      });
    }) || [];
  }),
  users: Ember.computed(function () {
    return this.get('store').findAll('user');
  }),
  userEmails: Ember.computed('users', 'users.content.isLoaded', function () {
    return this.get('users').map(function (item) {

      return Ember.Object.create({
        title: item.get('email')
      });
    });
  }),
  sortedUsers: Ember.computed('users.content.isLoaded', function () {
    return this.get('users').sortBy('label');
  }),
  actions: {
    nextStep(currentStep) {
      if (this.validateStep(currentStep)) {

        this.syncToServer(currentStep)
        this.incrementProperty('step')
      }
    },

    previousStep() {
      this.decrementProperty('step')
    },
    setStep(step) {
      this.set("step", step)
    },
    setProperty(property, obj) {
      this.set(property, obj.value)
    },

    addToRecipients(item) {
      this.set('alertNotification.recipients', item.map(function (it) {
        return it.title;
      }));
    },
    addNewRecipient(text) {
      let newUser = Ember.Object.create({
        title: text
      })
      this.get('userEmails').addObject(newUser);
      this.get('selectedRecipients').addObject(newUser);
      this.get('alertNotification.recipients').addObject(text);
    }

  }
});

