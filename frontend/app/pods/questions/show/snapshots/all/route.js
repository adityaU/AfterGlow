import Ember from 'ember';

export default Ember.Route.extend({
    afterModel(){
        // if (!this.can('show question')) {
        //     this.get('toast').error(
        //         "You are not authorized to perform this action",
        //         'Sorry Mate!',
        //         {closeButton: true, timeout: 1500, progressBar:false}
        //     );

        //     this.transitionTo('index');
        // }
    },
    renderTemplate(controller, model) {

        // Render the `favoritePost` template into
        // the outlet `posts`, and display the `favoritePost`
        // controller.
        this.render('questions.show.snapshots.all', {
            into: 'application',
            controller: controller
        });
    },

    setupController: function(controller, model) {
        this._super(...arguments);
        controller.set('question', this.controllerFor('questions.show').get('question'));
    }

});
