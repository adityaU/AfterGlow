import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggleColumns(table) {
      table.toggleProperty('open');
    },
    showAllColumns(table, ignoreOpen) {
      if (!table.get('open') || ignoreOpen){
        table.reload().then(()=> {
          table.set('open', true);
        });

      }else{
        table.set('open', false);

      }
    },
    pasteAtCursor(text){
      let editor = this.get('editor');
      editor.session.insert(editor.getCursorPosition(), text + ' ');
      editor.focus();
    }
  }
});
