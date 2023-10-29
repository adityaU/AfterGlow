<template>
  <floating-menu
    :items="filtersLocal"
    label="Filters"
    @clicked="(val) => (newFilter.showMenu = true)"
  >
    <template #itemsSlot>
      <div
        class="tw-inline"
        v-for="(filter, index) in filtersLocal"
        :key="filter"
      >
        <div class="tw-px-1 tw-py-1 tw-inline-flex tw-flex-nowrap">
          <FilterMenu
            @addFilter="prevent"
            addLabel="Done"
            @editFilter="(val) => (filter = val)"
            :filter="filter"
            :columns="columns"
            :colDetails="colDetails"
            :rows="rows"
          />
          <div
            class="btn tw-cursor-pointer tw-text-white hover:tw-bg-primary/80 tw-border-2 tw-border-primary"
            v-for="(dv, i) in getDisplayValues(filter, colDetails)"
            :key="dv"
            :class="i === 0 ? 'btn-left' : 'btn-center'"
            @click="filter.currentStage = dv[1]"
          >
            {{ dv[0] }}
          </div>
          <div
            class="btn btn-right tw-cursor-pointer"
            @click="(event) => removeFilter(index)"
          >
            <XIcon class="tw-inline tw-h3 tw-w-3" size="18" />
          </div>
        </div>
      </div>
    </template>
    <template #menuSlot>
      <FilterMenu
        @addFilter="addFilter"
        @editFilter="(val) => (newFilter = val)"
        addLabel="Add Filter"
        :reset="reset"
        v-model:filter="newFilter"
        :columns="columns"
        :colDetails="colDetails"
        :rows="rows"
      />
    </template>
  </floating-menu>
</template>

<script>
import FloatingMenu from 'components/base/floatingMultiSelect.vue';
import FilterMenu from 'components/queryTerms/filterMenu.vue';

import { FilterMixin } from 'src/mixins/filterMixins';

import { XIcon } from 'vue-tabler-icons';
import isEqual from 'lodash/isEqual';

import { _ } from 'lodash';
export default {
  name: 'AGFilters',

  props: ['columns', 'rows', 'colDetails', 'filters'],

  mixins: [FilterMixin],

  components: { FilterMenu, FloatingMenu, XIcon },

  data() {
    return {
      filtersLocal: this.filters.details || [],
      reset: false,
      newFilter: null,
    };
  },

  watch: {
    filters() {
      if (!isEqual(this.filtersLocal, this.filters.details)) {
        this.filtersLocal = this.filters.details;
      }
    },
    filtersLocal: {
      deep: true,
      handler() {
        this.$emit('update:filters', {
          towardsChild: false,
          details: this.filtersLocal,
        });
      },
    },
  },

  methods: {
    addFilter(filter) {
      this.filtersLocal.push(filter);
      this.reset = !this.reset;
    },

    removeFilter(index) {
      this.filtersLocal.splice(index, 1);
    },
  },
};
</script>
