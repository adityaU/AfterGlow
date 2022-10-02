import {verifyToken} from 'src/apis/auth';
import {currentUserStore} from 'stores/currentUser' 
import {useRoute} from 'vue-router';

const currentUser = currentUserStore()
const authMixin = {
  mounted(){
    const route = useRoute();
    const token = route.query.token
    verifyToken(token, this.setPermissions, this.redirect)
  },

  methods: {
    redirect(){
      // window.parent.location.href = '/login'
    },
    setPermissions(response){
      currentUser.set(response)
    }
  }
}

export {authMixin}
