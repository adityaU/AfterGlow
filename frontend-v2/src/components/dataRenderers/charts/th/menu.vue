<template>
  <q-menu
    flat="true"
    transition-show="scale"
    transition-hide="scale"
    max-height="400px"
    :offset="[0, 5]"
    class="tw-rounded-2xl tw-border tw-overflow-hidden"
    @keydown="onKeydown"
    auto-close
  >
    <div class="tw-border-t" v-if="showSorting">
      <div class="label tw-text-primary tw-p-2">Sort</div>
      <BoxSelect
        :options="sortOptions"
        class="tw-text-center tw-p-4"
        @selected="(val) => makeSorting(val)"
      />
    </div>
  </q-menu>
</template>

<script>
import BoxSelect from '../../../base/boxSelect.vue';
export default {
  name: 'AGTHMenu',
  components: { BoxSelect },
  props: ['column', 'showSorting'],
  data() {
    return {
      sortOptions: ['ascending', 'descending'].map((item) => {
        return { name: item, value: item };
      }),
    };
  },

  methods: {
    makeSorting(val) {
      const sorting = { column: this.column, direction: val, raw: false };
      this.$emit('addSorting', sorting);
    },
  },
};
</script>
