import Ember from 'ember';

export default Ember.Component.extend({
    tagName: "span",
    click(){
        this.toggleProperty("checked")
    }
});
