<template>

<div class="tw-p-3 tw-bg-white">
<AGInput label="Cache time in seconds" placeholder="example - 300 for 5 minutes, default: no caching" v-model:value="cache_time_in_seconds" class="tw-hidden"/>
<AGBool label="Can viewers change filters, view, group by and sort order" v-model:val="vizConfigLocal.can_viewers_change_query_terms"/>
<!-- <AGBool label="Can viewers see debug info" v-model:val="vizConfigLocal.can_viewers_see_debug_info" /> -->
<!-- <AGBool label="Can viewers view data in new visualization" v-model:val="quesConfigLocal.can_viewers_see_in_new_visualization" /> -->
<!-- <div class="tw-text-sm" > -->
<!-- Note: Viewers will not able to save visualizations. Use this option to restrict viewers to see only cached data -->
<!-- </div> -->
</div>
  

</template>
<script>

import AGBool from 'components/base/bool.vue'
import AGInput from 'components/base/agInput.vue'
export default {
  name: 'AGVizSettings',
  props: ['vizConfig', 'quesConfig'],
  components: {AGBool, AGInput},

  watch: {
    vizConfigLocal: {
      deep: true,
      handler(){
        console.log(this.vizConfigLocal)
        this.$emit('update:vizConfig', this.vizConfigLocal)
      }
    }
  },

  data() {
    return {
      vizConfigLocal: this.vizConfig || {can_viewers_see_debug_info: true, can_viewers_change_query_terms: true, cache_time_in_seconds: null},
      quesConfigLocal: this.vizConfig || {can_viewers_see_in_new_visualization: true, }
    }
  }
}
</script>
