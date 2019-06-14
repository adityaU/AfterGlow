
export default Ember.Controller.extend({
    settings: Ember.computed.alias('model'),


    frontend_limit_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "MAX_FRONTEND_LIMIT")
        })[0]
    }),


    actions: {
    }

});
