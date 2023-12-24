<template>
  <div class="tw-flex tw-w-full">
    <AGHeaderWithLogin />
    <div class="tw-flex-1 tw-h-[calc(100vh-33px)] tw-overflow-auto tw-relative">
      <router-view ref="root" class="" />
    </div>
  </div>
  <AGFooter />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue';

import resizerUrl from '../assets/js/iframe.content.min.js?url';
import AGHeaderWithLogin from 'components/header/withLogin.vue';
import AGFooter from 'components/footer/static.vue';
import { sidebarState } from 'src/stores/sidebarStore';

export default defineComponent({
  name: 'MainLayout',
  components: { AGHeaderWithLogin, AGFooter },

  mounted() {
    if (this.$route.path === '/' || this.$route.path === '') {
      this.$router.push('/questions/new');
    }
    let tag = document.createElement('script');
    tag.setAttribute('src', resizerUrl);
    document.head.appendChild(tag);

    const preloader = window.document.getElementById('preloader');
    if (preloader) {
      preloader.remove();
    }
  },
});
</script>
