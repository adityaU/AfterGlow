import { verifyToken } from 'src/apis/auth';
import { currentUserStore } from 'stores/currentUser';
import { useRoute } from 'vue-router';
import { sessionStore } from 'stores/session';

const session = sessionStore();

const currentUser = currentUserStore();

const authMixin = {
  async mounted() {
    const route = useRoute();
    const token = route.query.token || session.token;
    currentUser.reset();
    await verifyToken(token, this.setPermissionsAndTheme, this.redirect);
  },

  methods: {
    redirect() {
      this.$router.push('/login');
    },
    setPermissionsAndTheme(response) {
      this.setTheme(response.theme);
      currentUser.set(response);
    },

    rgbToColorString(rgb) {
      return /rgb\((.+)\)/i.exec(rgb);
    },

    setColorVar(root_theme, color, value) {
      if (value && this.rgbToColorString(value)) {
        root_theme.style.setProperty(color, this.rgbToColorString(value)[1]);
      }
    },
    setTheme(theme) {
      const root_theme = document.querySelector(':root');
      this.setColorVar(root_theme, '--color-primary', theme.primary_color);
      this.setColorVar(root_theme, '--color-secondary', theme.secondary_color);
      this.setColorVar(root_theme, '--color-tertiary', theme.tertiary_color);
      this.setColorVar(root_theme, '--color-white', theme.white_color);
      this.setColorVar(root_theme, '--color-default', theme.default_color);
    },
  },
};

export { authMixin };
