<template>
  <div class="tw-h-[100vh] tw-w-full">
    <div class="tw-flex tw-h-full tw-items-center tw-justify-center">
      <div
        class="tw-bg-white tw-border tw-rounded-2xl tw-p-4 tw-w-[400px] tw-h-[400px] tw-flex tw-flex-col tw-justify-center tw-items-center"
        v-if="loading"
      >
        <AGLoader text="Loging you in" />
      </div>
      <div
        class="tw-bg-white tw-border tw-rounded-2xl tw-p-4 tw-w-[400px] tw-flex tw-flex-col tw-justify-center tw-items-center"
        v-if="!loading"
      >
        <img src="/assets/images/logo.png" class="tw-w-[150px]" />
        <div class="tw-mt-4 tw-w-full">
          <AGInput
            class="tw-w-full"
            v-model:value="email"
            placeholder="Email"
          />
        </div>
        <div class="tw-mt-1 tw-w-full">
          <AGInput
            class="tw-w-full"
            v-model:value="password"
            placeholder="Password"
            type="password"
          />
        </div>
        <div class="note tw-text-red-700 tw-text-center" v-if="error">
          Email & password do not match to any account
        </div>
        <AGButton
          class="tw-mt-2 tw-w-full tw-bg-primary tw-text-white tw-uppercase"
          @click="login"
          :class="email && password ? '' : 'disabled'"
        >
          Login
        </AGButton>
        <AGHorizontalDivider text="OR" class="tw-mt-2" />
        <div class="note tw-text-red-700 tw-text-center" v-if="errorWithGoogle">
          {{ errorWithGoogleText }}
        </div>
        <AGButton
          class="tw-mt-2 tw-w-full tw-uppercase"
          @click="loginWithGoogle"
        >
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
import { login, loginWithGoogle, loginCallback } from 'src/apis/login';

import { sessionStore } from 'src/stores/session';
import { BrandGoogleIcon } from 'vue-tabler-icons';

const session = sessionStore();
export default {
  name: 'AGLogin',
  components: {
    AGInput,
    AGButton,
    BrandGoogleIcon,
    AGLoader,
    AGHorizontalDivider,
  },
  data() {
    return {
      email: null,
      password: null,
      loading: false,
      error: false,
      errorWithGoogleText: null,
      errorWithGoogle: false,
    };
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
    this.loading = false;
  },

  methods: {
    login() {
      this.error = false;
      this.errorWithGoogle = false;
      login(this.email, this.password, this.setSession);
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
    },
    setSession(data, loading) {
      if (data?.response?.status === 401) {
        this.error = true;
        this.loading = loading;
        return;
      }
      if (data?.response?.status === 422) {
        this.errorWithGoogle = true;
        this.errorWithGoogleText = data.response.data.error;
        this.loading = loading;
        this.$router.push({ path: '/login' });
        return;
      }
      if (data?.token) {
        session.setToken(data.token);
        this.$router.push({ path: '/questions/new' });
      }
    },
  },
};
</script>
