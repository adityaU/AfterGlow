import Ember from 'ember';

export default Ember.Controller.extend({
    dashboard: Ember.computed.alias('model'),
    nonEditable: "yes",
    fullScreen: false,
    actions: {
        editDashboard(){
            this.set('nonEditable', null)
            this.set('editMode', true)
        },
        saveDashboard(){
            let dashboard = this.get('dashboard')
            dashboard.save().then((response)=> {
                this.set('nonEditable', "yes")
                this.set('editMode', false)
            })
        },
        cancelEditingDashboard(){
            this.set('nonEditable', "yes")
            this.set('editMode', false)
        },
        showDeleteDialogue(){
            $('.ui.modal.delete-dialogue').modal('show')
        },
        deleteDashboard(dashboard){
            dashboard.destroyRecord().then((response)=>{
                this.transitionToRoute('index')
            })
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
