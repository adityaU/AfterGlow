import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    permissions: DS.hasMany('permission'),
    users: DS.hasMany('users'),

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
    displayPermissions: Ember.computed('permissions.content.isLoaded','permissions', function(){
       return  this.get('permissions').map((item)=>{
            return item.get('name')
        }).join(", ")
    })

});
