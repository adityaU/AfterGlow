import Ember from 'ember';
import AlertNewController from '../new/controller';
export default AlertNewController.extend({
  pageTitle: "Edit Alert",
  alert_setting: Ember.computed.alias('model'),

  timeUnitMultiplierReverse: {
    60: 'minutes',
    3600: "hours",
    86400: "days",
    604800: "weeks"
  },
  criticalLevelObserver: Ember.observer('alert_setting.alert_level_settings.content.isLoaded', function () {
    this.set('criticalLevel', this.get('alert_setting') && this.get('alert_setting.alert_level_settings').filter((item) => {
      return item.get('level') == "critical"
    }).objectAt(0)
    )
  }),
  warningLevelObserver: Ember.observer('alert_setting.alert_level_settings.content.isLoaded', function () {
    this.set('warningLevel', this.get('alert_setting') && this.get('alert_setting.alert_level_settings').filter((item) => {
      return item.get('level') == "warning"
    }).objectAt(0)
    )
  }),
  alertNotificationObserver: Ember.observer('alert_setting.alert_notification_settings.content.isLoaded', function () {
    this.set('alertNotification',
      this.get('alert_setting') && this.get('alert_setting.alert_notification_settings') && this.get('alert_setting.alert_notification_settings').objectAt(0))
  }),
  selectedAggregation: Ember.computed('alert_setting', function () {
    return {
      title: this.get('alert_setting.aggregation')
    }
  }),
  selectedColumn: Ember.computed('alert_setting', function () {
    return {
      title: this.get('alert_setting.column')
    }
  }),
  selectedTraversal: Ember.computed('alert_setting', function () {
    return {
      title: this.get('alert_setting.traversal')
    }
  }),

  selectedOperation: Ember.computed('alert_setting', function () {
    return {
      title: this.get('alert_setting.operation')
    }
  }),

  timeIntervalObserver: Ember.observer('timeUnit', 'timeInterval', 'alert_setting.frequency_value_in_seconds', function () {
    if (this.get('timeInterval') || this.get('timeUnit')) { return }
    let frequency = this.get('alert_setting.frequency_value_in_seconds')

    let timeUnitMultiplier = [604800, 86400, 3600, 60].filter((divident) => {
      return frequency % divident == 0
    })[0]

    this.set('timeUnit', { value: this.timeUnitMultiplierReverse[timeUnitMultiplier], title: this.timeUnitMultiplierReverse[timeUnitMultiplier] })
    this.set('timeInterval', frequency / timeUnitMultiplier)
  })



});

