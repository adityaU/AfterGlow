import Ember from 'ember';
import UtilsFunctions from "frontend/mixins/utils-functions";

var get = Ember.get,
    arrayComputed = Ember.arrayComputed;
export default Ember.Component.extend( UtilsFunctions, {
    chartData(item){
        return item.get('contents').map((el, j)=> {
            return el.x1
        })
    },
    chartOptions: Ember.computed(function(){
        let _this = this;
        return {
            legend: {
                position: 'left'
            },
            maintainAspectRatio: false,
            responsive: true,
            tooltips: {
                custom: function (tooltip) {

                    if (!tooltip) {
                        tooltipEl.css({
                            opacity: 0
                        });
                        return;
                    }
                    tooltip.backgroundColor = "rgb(0, 0, 0, 0.7)"
                    tooltip.bodyFontColor = "#fff"
                    tooltip.footerFontColor = "#fff"
                    tooltip.titleFontColor = "#fff"
                }
            }
        }
    }),
    chartScales: null,
    legendPosition: 'left',
    fill: null,
    lineTension: null,
    backgroundColor(i){return this.get('colors')},
    borderColor(i){return "#fff"},
    borderCapStyle: null,
    borderDash: null,
    borderDashOffset: null,
    borderJoinStyle: null,
    pointBorderColor(i){ return this.get('colors')}, 
    hoverBackgroundColor(i){ return this.get('colors')}, 
    pointBackgroundColor: null,
    pointBorderWidth: null,
    pointHoverRadius(item){return (30/(item.get('contents.length') + 1)) + 3},
    pointHoverBackgroundColor: null,
    pointHoverBorderColor(i){return this.get('colors')},
    pointHoverBorderWidth: null,
    pointRadius(item){ return (20/(item.get('contents.length') + 1)) + 2},
    pointHitRadius: null,
    // calculateXScale(item){
    //     return;
    // },
    labels(data){
        let total = data[0].get('contents').map((item)=>{return item.x1}).reduce((a, b) => a + b, 0)
        return data[0].get('contents').map((item)=>{
            return `${item.y} - ${Math.round((item.x1/total)*100)}%`
        })
    }
});
