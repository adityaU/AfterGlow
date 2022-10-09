<template>
  <div class="tw-ml-2 tw-inline-flex tw-flex-nowrap ">
                                <span class="btn tw-px-2 tw-border-primary tw-text-primary tw-font-semibold" :class="offset ? 'btn-left' : 'btn-full'">
                                Offset 
                                </span>
                                <span class="btn-right" v-if="offset"> {{offset}}  </span>
    <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px" :offset="[0, 5]"
      class="tw-rounded-sm tw-shadow-sm tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
      <AGInput invisible=true @inputed="(val) => $emit('update:offset', val)" :value="offset"
        placeholder="skip first n rows" type="number" />
    </q-menu>
  </div>
</template>

<script>



import AGInput from 'components/base/agInput.vue'


export default {

  name: 'AGOffset',

  props: ['offset'],

  components: { AGInput },



}
</script>
