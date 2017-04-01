import Ember from 'ember';

export default Ember.Service.extend({
    cookies: Ember.inject.service(),
    ajax: Ember.inject.service(),
    authenticated: false,
    token: null,
    setToken(token){
        localStorage.setItem('access_token', token)
        this.set('token', token);
    },
    setUser(user){
        this.set('user', user);
    },
    verifyToken(successCb, errorCb){
        let accessToken =  localStorage.getItem('access_token')
        this.set('token', accessToken);
        return this.get('ajax').apiCall({
            url: this.get('ajax.apiPath')+ '/verify-token/',
            type: 'POST',
            data: {token: accessToken},
        },(response, status)=>{
            this.set('user', response.user)
            this.set('permissions', response.permissions)
            this.set('authenticated', true)
            successCb(response, status)
        },(error, status)=>{
            errorCb(error, status)
        });
    },
    invalidate(){
        localStorage.setItem('access_token', null)
        this.set('token', null);
        this.set('authenticated', false)
    }
});
