import Ember from 'ember';

export default Ember.Component.extend({
  selectedUsers: Ember.computed('entity.shared_to', function () {
    return this.get('entity.shared_to') && this.get('entity.shared_to').map(function (item) {
      return Ember.Object.create({
        title: item
      });
    }) || [];
  }),
  users: Ember.computed(function () {
    return this.get('store').findAll('user');
  }),
  userEmails: Ember.computed('users', 'users.content.isLoaded', function () {
    return this.get('users').map(function (item) {

      return Ember.Object.create({
        title: item.get('email')
      });
    });
  }),
  sortedUsers: Ember.computed('users.content.isLoaded', function () {
    return this.get('users').sortBy('label');
  }),
  actions: {
    clearSharedTo() {
      this.get('entity').rollbackAttributes('shared_to');
      this.set('open', false);
    },
    saveSharedTo() {
      this.get('entity').save();
      this.set('open', false);
    },
    addToSharedTo(item) {
      this.set('entity.shared_to', item.map(function (it) {
        return it.title;
      }));
    },
    addNewSharedTo(text) {
      let newUser = Ember.Object.create({
        title: text
      })
      this.get('userEmails').addObject(newUser);
      this.get('selectedUsers').addObject(newUser);
      this.get('entity.shared_to').addObject(text);
    }
  }
});
