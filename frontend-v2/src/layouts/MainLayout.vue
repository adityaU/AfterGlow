<template>
  <router-view ref="root" class="" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue';

import resizerUrl from '../assets/js/iframe.content.min.js?url';

export default defineComponent({
  name: 'MainLayout',

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
