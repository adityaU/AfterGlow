import Ember from 'ember';
import ResultsViewMixin from 'frontend/mixins/result-view-mixin'
import HelperMixin from 'frontend/mixins/helper-mixin'

export default Ember.Component.extend(ResultsViewMixin, HelperMixin, {
  open: false,
  columnReplacable: true,
  resultViewPossibleKeys: [],
  columns: Ember.computed('results.columns', 'apiAction.column', 'question.api_action.@each.column', function () {
    return this.get('results.columns') && this.get('results.columns').filter((item) => {
      return !(this.get('question.api_actions').filter((apiAction) => {
        return apiAction.get('column') == item;
      }).length > 0);
    }).map((item) => {
      return {title: item};
    }) || [];
  }),

  selectedApiActionColumn: Ember.computed('apiAction.column', function () {
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
  isObj(value) {
    var objType = (Object.prototype.toString.call(value).replace(/\[object|\]/g, '').trim());
    return objType == 'Object'
  },

  getDisplayableKeys(obj, root, keys, isArray) {

    for (const prop in obj) {
      let fullKeyPath = root + "." + prop
      let objType = this.isDisplayable(obj[prop])
      if (objType) {
        keys.pushObject(Ember.Object.create({key: fullKeyPath, objType: isArray ? 'Array' : objType}))
      }
      if (this.isDisplayable(obj[prop]) == 'Object') {
        this.getDisplayableKeys(obj[prop], fullKeyPath, keys)
      } else if (this.isDisplayable(obj[prop]) == 'Array') {
        obj[prop].forEach((item) => {
          this.getDisplayableKeys(item, fullKeyPath + ".[*]", keys, true)
        })
      }
    }
    return keys

  },

  actions: {
    setApiActionColumn(column) {
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
    },

    previewAction() {
      this.get('apiAction').preview(this.get('apiAction')).then((response) => {
        var result;
        var displayableKeys = Ember.A([])
        this.set('loadError', false)
        this.set('results', null)
        try {
          result = JSON.parse(response.response_body)
          let rootKey = 'root'
          displayableKeys.pushObject(Ember.Object.create({key: 'root', objType: this.isDisplayable(response)}))
          displayableKeys = this.getDisplayableKeys(result, rootKey, displayableKeys)
          this.set('results', response)
          this.set('resultViewPossibleKeys', this.uniqueByProperty(displayableKeys, "key"))
        } catch (e) {
          console.log(e)
          console.log("============================")
          this.set('loadError', true)
          this.set('resultViewPossibleKeys', [])
        }
        this.set('openPreview', true)
        this.set('open', false);
      });
    }
  }
});
