import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['h-100'],
    didInsertElement() {
        this._super(...arguments);
        Simditor.locale = 'en-US';
    },
    isEditing: Ember.computed.alias('note.isEditing'),
    _editor() {
        var editor = new Simditor({
            textarea: document.getElementById(this.get('textareaRandomId')),
            placeholder: '',
            defaultImage: 'images/image.png',
            params: {},
            upload: false,
            tabIndent: true,
            toolbarFloat: true,
            toolbarFloatOffset: 0,
            toolbarHidden: false,
            pasteImage: false,
            cleanPaste: false,
            toolbar: [
                'title',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'fontScale',
                'color',
                '|',
                'ol',
                'ul',
                'blockquote',
                '|',
                'code',
                'table',
                'link',
                'image',
                '|',
                'indent',
                'outdent',
                'alignment'
            ]
        });
        var _this = this;
        editor.on('valuechanged', (e, src) => {
            this.set('note.content', editor.body.html());
        });
        return editor;
    },

    dashboardIsEditingObserver: Ember.observer('note.dashboard.isEditing', function () {
        this.get('note.dashboard.isEditing') && this.set('isEditing', false);
    }),

    isEditingObserver: Ember.on('init', Ember.observer('isEditing', function () {
        if (this.get('isEditing')) {
            Ember.run.next(this, function () {
                this.set('editor', this._editor());
            });
        }
    })),
    textarea: Ember.computed('randomId', function () {
        return document.getElementById(this.get('textareaRandomId'));
    }),

    textareaRandomId: Ember.computed(function () {
        return `textarea-${parseInt(Math.random() * 100000000)}`;
    }),
    actions: {
        toggleEditNote() {
            this.toggleProperty('isEditing');
            if (this.get('isEditing')) {

                this.set('note.dashboard.isEditing', false);
            }
        },
        deleteNote() {
            let newRecord = !this.get('note.id');
            if (newRecord) {
                this.set('note.dashboard.newNote', null);
            }
            this.get('note').destroyRecord();
        },
        saveNote() {
            let newRecord = !this.get('note.id');
            this.get('note').save().then((response) => {
                this.set('isEditing', false);
                if (newRecord) {
                    let notes_settings = this.get('note.dashboard.notes_settings');
                    let el = $('#js-notes-new').parents('.grid-stack-item');
                    if (Object.keys(notes_settings).length === 0) {
                        this.set('note.dashboard.notes_settings', Ember.Object.create());
                        notes_settings = this.get('note.dashboard.notes_settings');
                    }
                    notes_settings.set(response.id, {
                        x: el.data('gs-x'),
                        y: el.data('gs-y'),
                        width: el.data('gs-width'),
                        height: el.data('gs-height')
                    });

                }
                this.set('note.dashboard.newNote', null);
                this.set('note.dashboard.isEditing', true);
            });
        }
    }
});
