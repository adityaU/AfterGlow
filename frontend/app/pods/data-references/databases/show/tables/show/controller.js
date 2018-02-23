import Ember from 'ember';
import { CanMixin } from 'ember-can';

export default Ember.Controller.extend( CanMixin, {
    table: Ember.computed.alias('model'),

    canEdit: Ember.computed(function(){
        return this.can('edit question')
    }),
    columns: Ember.computed('query', 'table.columns.isFulfilled', function(){
        let query = this.get('query')
        if (query){
            return this.get('table.columns').filter((item)=>{
                return item.get('human_name') && item.get('human_name').toLowerCase().match(query.toLowerCase())
            }).sortBy('human_name')
        }
        return this.get('table.columns').sortBy('human_name');
    }),
    loading: Ember.computed.not('table.columns.isFulfilled'),
    actions: {
        editColumn(column){
            column.set('editMode', true);
        },
        saveColumn(column){
            column.save().then((response) =>{
                column.set('editMode', false);
            })
        }
    }
});
