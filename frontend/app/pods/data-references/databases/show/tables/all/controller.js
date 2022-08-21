import Ember from 'ember';
import { CanMixin } from 'ember-can';

export default Ember.Controller.extend(CanMixin,{

    canEdit: Ember.computed(function(){
        return this.can('edit question')
    }),
    tables: Ember.computed('query', 'database.tables.isFulfilled', function(){
        let query = this.get('query')
        if (query){
            return this.get('database.tables').filter((item)=>{
                return item.get('name') && item.get('name').toLowerCase().match(query.toLowerCase())
            }).sortBy('human_name')
        }
        return this.get('database.tables').sortBy('name');
    }),
    loading: Ember.computed.not('database.tables.isFulfilled'),
    actions: {
        editTable(table){
            table.set('editMode', true);
        },
        saveTable(table){
            table.save().then((response) =>{
                table.set('editMode', false);
            })
        },
        cancelEdit(table){
            table.set('editMode', false);
        },
    }
});
