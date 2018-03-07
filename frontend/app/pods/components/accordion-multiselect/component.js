import Ember from 'ember';
import HelperMixin from 'frontend/mixins/helper-mixin'


export default Ember.Component.extend(HelperMixin, {
    showableOptions: Ember.computed('options', "selection", function(){
        return this.uniqueByProperty((Ember.copy(this.get('selection')) || []).addObjects(this.get('options') || []), this.get('labelProperty'))
    }),

    actions: {
        remove(item){
            this.get('selection').removeObject(item)
        }
    }
});
