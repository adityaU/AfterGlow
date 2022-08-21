<template>
  <q-layout view="lHh Lpr lFf" ref="root">
      <router-view ref="root" />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue';


const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

export default defineComponent({
  name: 'MainLayout',

  // components: {
  //   EssentialLink
  // },

  methods :{
  },


  setup () {
    const root = ref(null)

    var updateHeight = function() {
        const root = ref("root")
        console.log('updated !!!!!!!!!');
        if ( root.value && root.value.$el) {
          window.parent.postMessage({event: 'ag_frontend_mounted', height: root.value.$el.offsetHeight}, '*');
        }
    }

    onMounted(() => {
      updateHeight()
    })

    onUpdated(() => {
      updateHeight()
    })

    return {
      essentialLinks: linksList,
      root
    }
  }
});
</script>
