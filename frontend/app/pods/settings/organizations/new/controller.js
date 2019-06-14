import Ember from 'ember';

export default Ember.Controller.extend({
    organization: Ember.computed(function () {
        return this.store.createRecord('organization', {})
    }),


    actions: {
        saveOrganization() {

            this.get('organization').save().then((response) => {
                this.transitionToRoute('settings.organizations.edit', response.id);
            })

        }
    }
});
