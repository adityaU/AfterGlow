
import Ember from 'ember';


export default Ember.Mixin.create({
  getDefaultValuesforColumn(columnDataType) {

    let value = null;
    if (columnDataType) {
      if (columnDataType.match('time') || columnDataType.match('date')) {
        value = new Date();
      } else if (columnDataType.match('int') || columnDataType.match('number')) {
        value = 100;
      } else if (columnDataType.match('json')) {
        value = { a: 1 };
      } else if (columnDataType.match('char') || columnDataType.match('blob') || columnDataType.match('text') || columnDataType.match('string')) {
        value = 'char';
      }
    }
    return value;
  },

  guessDataType(value) {

    var objType = (Object.prototype.toString.call(value).replace(/\[object|\]/g, '').trim());
    if (objType == 'Object' || objType == 'Array') {
      return 'json';
    }

    if (moment(value, moment.ISO_8601, true).isValid()) {
      return 'datetime';
    }
    if (value == +value) {
      return 'number';
    }
    return 'string';
  },


  findAvailableOperators(value) {

    let dataType = this.guessDataType(value);
    let operators = [];
    if (dataType == 'string') {
      operators = ['=', '!=', 'is NULL', 'is not NULL', 'matches', 'starts with', 'ends with'];
    } else if (dataType == 'json') {
      operators = ['is NULL', 'is not NULL'];
    } else if (dataType == 'number' || dataType == 'datetime') {
      operators = ['>', '<', '>=', '<=', 'is NULL', 'is not NULL', '=', '!='];
    } else {
      operators = ['>', '<', '>=', '<=', 'is NULL', 'is not NULL', 'matches', '=', '!=', 'starts with', 'ends with'];
    }

    return this.get('operators').filter((item) => {
      return operators.indexOf(item.value) >= 0;
    });

  },

  noValueOperators: ['is NULL', 'is not NULL'],

  operators: [
    { name: 'is greater than', value: '>' },
    { name: 'is less than', value: '<' },
    { name: 'is greater than or equals to', value: '>=' },
    { name: 'is less than or equals to', value: '<=' },
    { name: 'matches', value: 'matches' },
    { name: 'starts_with', value: 'starts with' },
    { name: 'ends_with', value: 'ends with' },
    { name: 'is nil', value: 'is NULL' },
    { name: 'is not nil', value: 'is not NULL' },
    { name: 'is', value: '=' },
    { name: 'is not ', value: '!=' }
  ],
});
