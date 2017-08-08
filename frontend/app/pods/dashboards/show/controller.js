import Ember from 'ember';

export default Ember.Controller.extend({
    dashboard: Ember.computed.alias('model'),
    nonEditable: "yes",
    fullScreen: false,
    refreshIntervals: [
        {name: "Never", value: null},
        {name: "5 Seconds", value: 5000},
        {name: "10 Seconds", value: 10000},
        {name: "30 Seconds", value: 30000},
        {name: "1 Minute", value: 60000},
        {name: "5 Minutes", value: 300000},
        {name: "15 Minutes", value: 900000},
        {name: "30 Minutes", value: 1800000},
    ],
    refreshInterval: {name: "Never", value: null},
    schedule: function(f) {
        return Ember.run.later(this, function() {
            f.apply(this);
            this.set('timer', this.schedule(f));
        }, this.get('refreshInterval.value'));
    },

    stopTimer: function() {
        Ember.run.cancel(this.get('timer'));
    },

    startTimer: function() {
        let questions = this.get('dashboard.questions')
        questions && questions.forEach((item)=>{
            item.set('resultsCanBeLoaded', true) 
            item.set('updated_at', new Date());
        })
        this.set('timer', this.schedule(this.get('onPoll')));
    },

    onPoll: function(){
        this.get('dashboard.questions').forEach((item)=>{
            item.set('updated_at', new Date());
            item.set('resultsCanBeLoaded', true)
        }) 
    },
    refreshIntervalObserver: Ember.observer('refreshInterval', function(){
        let refreshInterval = this.get('refreshInterval')
        if (refreshInterval.value != null){
            this.stopTimer()
            this.startTimer()
        }else{
            this.stopTimer()
        }
    }),
    actions: {
        editDashboard(){
            this.set('nonEditable', null)
            this.set('editMode', true)
        },
        saveDashboard(){
            let dashboard = this.get('dashboard')
            let settings = {}
            dashboard.get('questions').forEach((item)=>{
                let el = $("#" + item.get('id')).parents('.grid-stack-item')
                settings[item.get('id')] = {
                    x: el.data('gs-x'),
                    y: el.data('gs-y'),
                    width: el.data('gs-width'),
                    height: el.data('gs-height')
                    // noMove: this.get('nonEditable'),
                    // noResize: this.get('nonEditable')
                }
            })
            dashboard.set('settings', Ember.Object.create(settings))
            dashboard.save().then((response)=> {
                dashboard.get('variables').invoke('save')
            }).then((variables)=>{
                this.set('nonEditable', "yes")
                this.set('editMode', false)
            })
        },
        cancelEditingDashboard(){
            this.set('nonEditable', "yes")
            this.set('editMode', false)
        },
        showShareDialogue(){
            $('.ui.modal.share-entity').modal('show')
        },
        showDeleteDialogue(){
            $('.ui.modal.delete-dialogue').modal('show')
        },
        deleteDashboard(dashboard){
            dashboard.destroyRecord().then((response)=>{
                this.transitionToRoute('index')
            })
        },
        setRefreshInterval(interval){
            this.set('refreshInterval', interval); 
        },
        refreshNow(){
            let questions = this.get('dashboard.questions')
            questions && questions.forEach((item)=>{
                item.set('resultsCanBeLoaded', true) 
                item.set('updated_at', new Date())
            })
        },
        showVariablesDialogue(){
            $(".ui.modal.select-dashboard-variables").modal('show')
        },
        toggleFullScreen(){
            if (
                document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement
            ) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                this.set('fullScreen', false);
            } else {
                let element = Ember.$(".without-header").get(0);
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
                this.set('fullScreen', true);
            } 
        }
    }
});