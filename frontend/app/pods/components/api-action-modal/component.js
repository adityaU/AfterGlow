import Ember from 'ember';

export default Ember.Component.extend({
    open: false,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    colors: ['indigo', 'red', 'yellow', 'teal'],

    showOpenInNewTab: Ember.computed('apiAction.method', 'apiAction.headers', 'apiAction.body', function () {
        let headers = this.get('apiAction.headers');
        let body = this.get('apiAction.body');
        let method = this.get('apiAction.method');

        if (method == 'GET' && headers.length == 0 && !body) {
            return true;
        }
        return false;
    }),

    actions: {
        clear() {
            this.set('open', false);
        },
        changeColor(value) {
            this.set('apiAction.color', Ember.$(value.currentTarget).attr('name'));
        },
        changeMethod(value) {
            this.set('apiAction.method', Ember.$(value.currentTarget).attr('name'));
        },
        saveApiAction() {
            // this.get('apiAction.headersArray').forEach((item) => {
            //     this.set(`apiAction.headers.${item.key}`, item.value);
            // });
            this.get('apiAction').save().then((response) => {
                this.set('open', false);
            });
        }
    }
});
