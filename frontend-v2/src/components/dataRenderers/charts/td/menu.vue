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
    <SelectOptions
      :options="copyOptions"
      @select="copyValue"
      hideSearch="true"
    />
    <div class="tw-border-t" v-if="showFilters">
      <div class="label tw-text-primary tw-px-2 tw-pt-2">Filter</div>
      <BoxSelect
        :options="boxSelectOperatorOptions"
        class="tw-text-center tw-my-1"
        @selected="(val) => makeFilter(val)"
      />
    </div>
  </q-menu>
</template>

<script>
import SelectOptions from '../../../base/selectOptions.vue';
import BoxSelect from '../../../base/boxSelect.vue';
import { operatorOptions } from 'src/helpers/dataTypes';
import { date } from 'quasar';
import { datetimeFormat } from 'src/mixins/filterMixins';
export default {
  name: 'AGTDMenu',
  components: { SelectOptions, BoxSelect },
  props: ['formattedValue', 'value', 'dataType', 'column', 'showFilters'],
  data() {
    return {
      copyOptions: ['Copy Exact Value', 'Copy formatted value'],
    };
  },

  computed: {
    boxSelectOperatorOptions() {
      return operatorOptions[this.dataType].map((item) => {
        return { name: item, value: item };
      });
    },
  },

  methods: {
    copyValue(val) {
      if (this.copyOptions.indexOf(val) == 0) {
        navigator.clipboard.writeText(this.value);
        return;
      }

      if (this.copyOptions.indexOf(val) == 1) {
        navigator.clipboard.writeText(this.formattedValue);
        return;
      }
    },
    makeFilter(op) {
      let value = '';
      if (this.dataType === 'datetime') {
        value = {
          type: 'datepicker',
          value: date.formatDate(new Date(this.value), datetimeFormat),
        };
      } else {
        value = this.value;
      }

      let filter = {
        column: this.column,
        operator: op,
        value: value,
        raw: false,
      };
      this.$emit('addFilter', filter);
    },
  },
};
</script>
