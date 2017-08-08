import Ember from 'ember';

export default Ember.Component.extend({

    showDropdown: Ember.computed('showTags', 'queryObject.table.human_name', 'queryObject.table', 'forceShowDropdown',  function(){
        if (!this.get('queryObject.table.human_name')){
            return true
        }else if (this.get('forceShowDropdown')){
            return true
        }else{
            return false
        }
    }),
    tableNameObserver: Ember.observer('queryObject.table.human_name', function(){
        this.set('forceShowDropdown', false);
        this.set('showTags', true);
    }),
    showTags: true,

    actions: {
        toggleShowDropdown(){
            this.set('showTags', false);
            this.set('forceShowDropdown', true)
        }
    }
});
