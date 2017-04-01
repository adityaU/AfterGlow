import Ember from 'ember';

export default Ember.Component.extend({
  operators: [
    {name: "is greater than" , value: ">" },
    {name: "is less than" , value: "<" },
    {name: "is greater than or equals to" , value: ">=" },
        {name: "is less than or equals to" , value: "<=" },
        {name: "is" , value: "=" },
        {name: "is not " , value: "!=" },
        ],
  operations: [
        {name: "value" , value: "value" },
        {name: "average of values" , value: "average" },
        {name: "sum of values" , value: "sum" },
  ],
  withinTypes: [
        {name: "any" , value: "any" },
        {name: "consecutive" , value: "consecutive" },

  ],
});
