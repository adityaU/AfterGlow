<template>

<div class="tw-p-3 tw-bg-white">
<AGInput label="Cache time in seconds" placeholder="example - 300 for 5 minutes, default: no caching" v-model:value="vizConfigLocal.cache_time_in_seconds" type="number" />
<AGBool label="Can viewers change filters, view, group by and sort order" v-model:val="vizConfigLocal.can_viewers_change_query_terms"/>
</div>
  

</template>
<script>

import AGBool from 'components/base/bool.vue'
import AGInput from 'components/base/agInput.vue'
import {_} from 'lodash';
export default {
  name: 'AGVizSettings',
  props: ['vizConfig', 'quesConfig'],
  components: {AGBool, AGInput},

  watch: {
    vizConfigLocal: {
      deep: true,
      handler(){
        this.$emit('update:vizConfig', this.vizConfigLocal)
      }
    }
  },

  data() {
    return {
      vizConfigLocal: _.cloneDeep(this.vizConfig) || _.cloneDeep(this.quesConfig) || { can_viewers_change_query_terms: true, cache_time_in_seconds: null},
    }
  }
}
</script>
