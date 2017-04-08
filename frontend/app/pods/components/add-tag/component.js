import Ember from 'ember';

export default Ember.Component.extend({
    availableTags: Ember.computed.setDiff('tags', 'entity.tags'),
    actions: {
        createTag(){
            $('.ui.modal.create-tag').modal('show')
        },

        removeTag(tag){
            this.get('entity.tags').removeObject(tag)
        },
        addTag(tag){
            this.get('entity.tags').pushObject(tag)
        },
        saveEntity(entity){
            entity.save();
        },
        addToTag(tag){
            this.sendAction("addToTag" , tag)
        }
    }
});
