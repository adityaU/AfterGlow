import { verifyToken } from 'src/apis/auth';
import { currentUserStore } from 'stores/currentUser'
import { useRoute } from 'vue-router';
import { sessionStore } from 'stores/session'

const session = sessionStore()

const currentUser = currentUserStore()

const authMixin = {
  mounted() {
    const route = useRoute();
    const token = route.query.token || session.token
    verifyToken(token, this.setPermissions, this.redirect)
  },

  methods: {
    redirect() {
      this.$router.push('/login')
    },
    setPermissions(response) {
      currentUser.set(response)
    }
  }
}

export { authMixin }
