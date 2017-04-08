import Ember from 'ember';
import ColorMixin from '../../../mixins/colors-mixin'

export default Ember.Component.extend(ColorMixin, {
    tag: {},
    actions:{
        createAndAddToTag(entity){
            let tag = this.store.createRecord('tag', {
                name: this.get('tag.name'),
                description: this.get('tag.description'),
                color: this.randomColor()
            })
            tag.get(this.get('entityName')).addObject(entity)
            tag.save().then((response)=> {
                entity.get('tags').pushObject(response)
                this.sendAction('getData', response)
            })
        }
    }

});
