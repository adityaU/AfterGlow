import Ember from 'ember';
import ColorMixin from '../../../mixins/colors-mixin'

export default Ember.Component.extend(ColorMixin, {
    tags: Ember.computed(function () {
        return this.get('store').findAll('tag')
    }),
    selectedTags: Ember.computed('entity.tags','entity.tags.content.isLoaded', function () {
        return this.get('entity.tags').map((item)=> {
            return this.get('store').peekRecord('tag', item.get('id'))
        }).filter((item) => {
            return item != undefined;
        })
    }),
    actions: {
        clear() {
            this.set('open', false)
        },
        addNewTag(text) {
            let tag = this.get('store').createRecord('tag', {
                name: text,
                color: this.randomColor()
            })
            tag.save().then((response) => {
                this.get('entity.tags').pushObject(tag)
            })
        },
        createTag(){
            $('.ui.modal.create-tag').modal('show')
        },

        removeTag(tag){
            this.get('entity.tags').removeObject(tag)
        },
        addTag(tag){
            debugger
            this.get('entity.tags').pushObject(tag)
        },
        saveEntity(){
            this.get('entity').save();
            this.set('open', false);
        },

        addToTag(tag){
            this.sendAction("addToTag" , tag)
        }
    }
});
