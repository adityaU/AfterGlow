<template>
  <div class="tw-h-[100vh] tw-w-full">
    <div class="tw-flex tw-h-full tw-items-center tw-justify-center">
      <div
        class="tw-bg-white tw-border tw-rounded-2xl tw-p-4 tw-w-[400px] tw-h-[400px] tw-flex tw-flex-col tw-justify-center tw-items-center"
        v-if="loading">
        <AGLoader text="Loging you in" />
      </div>
      <div
        class="tw-bg-white tw-border tw-rounded-2xl tw-p-4 tw-w-[400px] tw-flex tw-flex-col tw-justify-center tw-items-center"
        v-if="!loading">
        <img src="/assets/images/logo.png" class="tw-w-[150px]" />
        <div class="tw-mt-4 tw-w-full">
          <AGInput class="tw-w-full" v-model:value="email" placeholder="Email" />
        </div>
        <div class="tw-mt-1 tw-w-full">
          <AGInput class="tw-w-full" v-model:value="password" placeholder="Password" type="password" />
        </div>
        <div class="note tw-text-red-700 tw-text-center" v-if="error">
          {{ passwordLoginError }}
        </div>
        <AGButton class="tw-mt-2 tw-w-full tw-bg-primary tw-text-white tw-uppercase" @click="login"
          :class="email && password ? '' : 'disabled'">
          Login
        </AGButton>
        <AGHorizontalDivider text="OR" class="tw-mt-2" />
        <div class="note tw-text-red-700 tw-text-center" v-if="errorWithGoogle">
          {{ errorWithGoogleText }}
        </div>
        <AGButton class="tw-mt-2 tw-w-full tw-uppercase" @click="loginWithSAML" v-if="samlLoginEnabled">
          <div class="tw-flex tw-items-center tw-justify-center tw-gap-2">
            <KeyIcon size="16" class="tw-stroke-red-700" />
            Login With SSO
          </div>
        </AGButton>
        <AGButton class="tw-mt-2 tw-w-full tw-uppercase" @click="loginWithGoogle" v-if="googleLoginEnabled">
          <div class="tw-flex tw-items-center tw-justify-center tw-gap-2">
            <BrandGoogleIcon size="16" class="tw-stroke-red-700" />
            Login With Google
          </div>
        </AGButton>
      </div>
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGButton from 'components/base/button.vue';
import AGLoader from 'components/utils/loader.vue';
import AGHorizontalDivider from 'components/utils/horizontalDividerWithText.vue';
import { fetchInitConfigurations, login, loginWithGoogle, loginWithSAML, loginCallback, samlLoginCallback } from 'src/apis/login';

import { sessionStore } from 'src/stores/session';
import { BrandGoogleIcon, KeyIcon } from 'vue-tabler-icons';
import { currentUserStore } from 'src/stores/currentUser';

const session = sessionStore();
const currentUser = currentUserStore();
export default {
  name: 'AGLogin',
  components: {
    AGInput,
    AGButton,
    BrandGoogleIcon,
    AGLoader,
    AGHorizontalDivider,
    KeyIcon
  },
  data() {
    return {
      email: null,
      password: null,
      loading: false,
      error: false,
      errorWithGoogleText: null,
      errorWithGoogle: false,
      googleLoginEnabled: false,
      samlLoginEnabled: false,
      currentUser: currentUser,
      passwordLoginError: null
    };
  },

  mounted() {
    fetchInitConfigurations(this.setLoginOptions);
  },

  created() {
    const route = this.$route;
    this.loading = true;
    if (route.path === '/api/google/callback') {
      loginCallback(
        window.location.search.replace('?code=', ''),
        'google',
        this.setSession
      );
      return;
    }
    if (route.path === '/api/saml/acs') {

      session.setToken(route.query.token);
      this.$router.push({ path: '/questions/new' });
      return;
    }
    this.loading = false;
  },

  methods: {
    setLoginOptions(data, loading) {
      if (data) {
        this.googleLoginEnabled = data.google_login_enabled;
        this.samlLoginEnabled = data.saml_login_enabled;
        this.currentUser.setTheme(data.theme);
        this.setTheme(data.theme);
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

    rgbToColorString(rgb) {
      return /rgb\((.+)\)/i.exec(rgb);
    },

    setColorVar(root_theme, color, value) {
      if (value && this.rgbToColorString(value)) {
        root_theme.style.setProperty(color, this.rgbToColorString(value)[1]);
      }
    },
    login() {
      this.error = false;
      this.errorWithGoogle = false;
      login(this.email, this.password, this.setSession);
    },
    loginWithSAML() {
      this.error = false;
      this.errorWithSaml = false;
      this.loading = true;
      window.location = window.location.origin + '/api/v2/auth/saml';
    },
    loginWithGoogle() {
      this.error = false;
      this.errorWithGoogle = false;
      this.loading = true;
      loginWithGoogle(this.setRedirection);
    },

    setRedirection(data, loading) {
      if (data?.path) {
        window.location = data.path;
      }
      if (data?.data) {
        window.location = data.data;
      }

    },
    setSession(data, loading) {
      if (data?.response?.status === 400) {
        this.error = true;
        this.loading = loading;
        this.passwordLoginError = data.response.data.error;
        return;
      }
      if (data?.response?.status === 422) {
        this.errorWithGoogle = true;
        this.errorWithGoogleText = data.response.data.error;
        this.loading = loading;
        this.$router.push({ path: '/login' });
        return;
      }
      if (data?.data) {
        session.setToken(data.data);
        this.$router.push({ path: '/questions/new' });
      }
      if (data?.token) {
        session.setToken(data.token);
        this.$router.push({ path: '/questions/new' });
      }
    },
  }
}
</script>
