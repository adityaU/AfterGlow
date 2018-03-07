import Ember from 'ember';
import UtilsFunctions from 'frontend/mixins/utils-functions'

export default Ember.Component.extend(UtilsFunctions, {
    chartTypes: Ember.computed(function(){
        return ["Line", "Bars", "Area", "Bubble"]
    }),
    lineShapeTypes: [
        {
            name: "smooth",
            value: "spline"
        },
        {
            name: "straight",
            value: "linear"
        }
    ],
    barType:   {
          name: "Group",
          value: "group"
      },
    barTypes: [
        {
            name: "Stacked",
            value: "stack"
        },
        {
            name: "Group",
            value: "group"
        }
    ],
    x1Name: 'x1',
    x2Name: 'x2',
    yName: 'y',
    actions: {
        clearx2(){
            this.set('x2', null)
        },
        addYColumn(){
            let multipleYs = this.get('multipleYs')
            if (multipleYs) {
                multipleYs.pushObject({columnName: null})
            }else{
                this.set('multipleYs', [{}])
            }
        },
        removeColumn(data){
            this.get('multipleYs').removeObject(data)
        }
    }
});
