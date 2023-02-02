import { createApp, h } from 'vue'

const getIconHtml = function(icon) {
  // const tempApp = createApp({
  //   render() {
  //     return h(icon, {
  //       size: 16,
  //     })
  //   }
  // })

  // // in Vue 3 we need real element to mount to unlike in Vue 2 where mount() could be called without argument...
  // const el = document.createElement('div');
  // const mountedApp = tempApp.mount(el)

  // return mountedApp.$el.outerHTML
}

export { getIconHtml }
