import Ember from 'ember';

export default Ember.Component.extend({
  open: false,
  columns: Ember.computed('results.columns', 'apiAction.column','question.api_action.@each.column', function(){
    return this.get('results.columns') && this.get('results.columns').filter((item)=>{
      return !(this.get('question.api_actions').filter((apiAction)=>{
        return apiAction.get('column') == item;
      }).length > 0);
    }).map((item)=>{
      return {title: item};
    }) || [];
  }),

  selectedApiActionColumn: Ember.computed('apiAction.column', function(){
    return this.get('apiAction.column') && {title: this.get('apiAction.column')};
  }),

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  colors: ['indigo', 'red', 'yellow', 'teal'],

  showOpenInNewTab: Ember.computed('apiAction.method', 'apiAction.headers', 'apiAction.body', function () {
    let headers = this.get('apiAction.headers');
    let body = this.get('apiAction.body');
    let method = this.get('apiAction.method');

    if (method == 'GET' && headers.length == 0 && !body) {
      return true;
    }
    return false;
  }),

  actions: {
    setApiActionColumn(column){
      this.set('apiAction.column', column && column.title);
    },
    clear() {
      this.set('open', false);
    },
    changeColor(value) {
      this.set('apiAction.color', Ember.$(value.currentTarget).attr('name'));
    },
    changeMethod(value) {
      this.set('apiAction.method', Ember.$(value.currentTarget).attr('name'));
    },
    saveApiAction() {
      // this.get('apiAction.headersArray').forEach((item) => {
      //     this.set(`apiAction.headers.${item.key}`, item.value);
      // });
      this.get('apiAction').save().then((response) => {
        this.set('open', false);
      });
    }
  }
});
