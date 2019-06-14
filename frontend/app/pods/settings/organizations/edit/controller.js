import Ember from 'ember';

export default Ember.Controller.extend({
    organization: Ember.computed.alias('model.organization'),
    organization_settings: Ember.computed.alias('model.organization_settings'),

    report_limit_setting: Ember.computed('organization', "organization_settings.isLoaded", function () {
        return this.get('organization_settings').filter((setting) => {
            return (setting.get('name') == "MAX_DOWNLOAD_LIMIT" && setting.get('setting_type') == "general")
        })[0]
    }),

    frontend_limit_setting: Ember.computed('organization', "organization_settings.isLoaded", function () {
        return this.get('organization_settings').filter((setting) => {
            return (setting.get('name') == "MAX_FRONTEND_LIMIT" && setting.get('setting_type') == "general")
        })[0]
    }),

    download_allowed_setting: Ember.computed('organization', "organization_settings.isLoaded", function () {
        return this.get('organization_settings').filter((setting) => {
            return (setting.get('name') == "DOWNLOAD_ALLOWED" && setting.get('setting_type') == "general")
        })[0]
    }),

    actions: {
        setDownloadAllowedSetting() {
            let currentValue = this.get('download_allowed_setting.value')
            if (currentValue == 'false') {
                this.set('download_allowed_setting.value', "true")
            } else {
                this.set('download_allowed_setting.value', "false")
            }
        }
    }
});
