
<template>
  <div class="tw-mx-2 tw-inline-flex tw-flex-nowrap ">
    <span class="btn tw-border-primary tw-text-primary tw-font-semibold"
      :class="limit ? 'btn-left tw-bg-white' : 'btn-full'">
      Limit
    </span>
    <span class="btn-right" v-if="limit"> {{ limit }} </span>
    <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px" :offset="[0, 5]"
      class="tw-rounded-sm tw-shadow-sm tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
      <AGInput invisible=true @inputed="(val) => $emit('update:limit', val)" :value="limit" placeholder="Limit"
        type="number" />
    </q-menu>
  </div>
</template>

<script>



import AGInput from 'components/base/agInput.vue'


export default {

  name: 'AGLimit',

  props: ['limit'],

  components: { AGInput },



}
</script>
