import Ember from 'ember';
import { CanMixin } from 'ember-can';

export default Ember.Controller.extend( CanMixin, {

  canEdit: Ember.computed(function(){
    return this.can('edit question');
  }),
  databases: Ember.computed.alias('model'),
  actions: {
    syncDatabase(database){
      database.sync().then((response)=>{
        this.get('toast').success(
          'Databse Sync was successfully initiated. Please wait for few minutes for it to complete',
          'YaY!',
          {closeButton: true, timeout: 15000, progressBar:false}
        );
      });
    }
  }
});
