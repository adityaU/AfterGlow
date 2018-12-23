import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        deleteKey(element) {
            this.get('objArray').removeObject(element);
        },
        addMore() {
            this.get('objArray').pushObject({
                key: '',
                value: ''
            });
        }
    }
});
