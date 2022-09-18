
<template>
  <div class="btn tw-inline-flex tw-flex-nowrap tw-px-2 tw-py-1">
  <AGInput invisible=true @inputed="(val) => ((limitLocal = val) || true)" label="Limit" :value="limitLocal" placeholder="Limit" />
  </div>
</template>

<script>



import AGInput from 'components/base/agInput.vue'


export default {

  name: 'AGFilters',

  props: [],

  components: { AGInput },

  data() {
    return {
      limitLocal: null
    }
  },

  methods: {
  }

}
</script>
