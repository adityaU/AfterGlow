import Ember from 'ember';
export default Ember.Component.extend({
    aceTheme: 'ace/theme/ambiance',
    aceMode: 'ace/mode/JSON',

    status: Ember.computed('result.status_code', function () {
        let status = this.get('result.status_code');
        if (status >= 200 && status < 400) {
            return {
                color: 'teal',
                text: 'success'
            };
        } else if ((status >= 400 && status < 500)) {
            return {
                color: 'red',
                text: 'error in Action Setup'
            };
        } else if (status >= 500) {
            return {
                color: 'red',
                text: 'Server Error'
            };
        }
        return {
            color: 'gray',
            text: 'status: unknown'
        };
    }),

    responseBody: Ember.computed('result.response_body', function () {
        try {
            return JSON.stringify(JSON.parse(this.get('result.response_body')), null, 2);
        } catch (err) {
            return this.get('result.response_body');
        }
    }),

    debugResponse: Ember.computed('result.response_body', function () {
        try {
            return JSON.stringify(this.get('result'), null, 2);
        } catch (err) {
            return this.get('result');
        }
    }),

    actions: {
        clear() {
            this.set('open', false);
        }
    }
});
