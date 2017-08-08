import Ember from 'ember';


export default Ember.Mixin.create({
    colors:Ember.computed(function(){
        return [
            "#2196F3", "#4CAF50", "#f44336",  "#9c27b0", "#009688",
            "673AB7", "#3F51B5", "#009688", "#E91E63", "#607D8B",
            "#FF5722", "#1C9363", "#FF715B",  "#2B59C3", "#215B56",
            "#00bcd4", "#ff5722", "#ffc107",
            "#301966", "#D36582", "#820646", "#649BC1", "#4B3F72",
            "#db3340", "#df514c", "#5c2d50", "#5e3448", "#53bbf4",
            "#59c4c5", "#bff073", "#e45f56", "#c91b26", "#737495",
            "#5c2d50", "#20457c", "#0f5959", "#9f92aa", "#ffa200",
            "#24a8ac", "#ff4c65", "#e94c6f", "#354458", "#69d2e7",
            "#dc2742", "#3a0256", "#17a697", "#064789", "#ffc33c"
        ].map((item)=> {
            return this.opacity(item, 0.9)
        })
    }),
    opacity(hex, opacity) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        result = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: opacity
        } : null;
        return `rgba(${result.r},${result.g}, ${result.b}, ${result.a} )`
    },
    randomColor(){
        let arr = this.get("colors");
        return arr[Math.floor(Math.random() * arr.length)]
    }
})
