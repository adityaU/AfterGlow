<template>
  <div class="tw-flex tw-p-2">
    <template v-for="f in filters" :key="f">
      <div
        class="tw-flex tw-items-center tw-m-1 tw-cursor-pointer tw-leading-4"
      >
        <div class="tw-flex">
          <div
            class="tw-bg-primary/90 tw-text-white tw-px-2 tw-py-1 tw-rounded-l-sm tw-flex tw-gap-2"
            :class="f.value ? 'tw-rounded-l-sm' : 'tw-rounded-sm'"
          >
            <SearchIcon size="16" />
            {{ f.displayName || f.name }}
          </div>
          <div
            class="tw-bg-primary tw-text-white tw-px-2 tw-py-1 tw-rounded-r-sm"
            v-if="f.value"
          >
            {{ f.value }}
          </div>
          <q-menu
            flat="true"
            transition-show="jump-down"
            transition-hide="jump-up"
            max-height="400px"
            class="tw-rounded-2xl tw-border tw-overflow-hidden"
            @show="menuShow"
            @keydown="onKeydown"
            fit
          >
            <AGInput
              :placeholder="'Enter ' + (f.displayName || f.name)"
              v-model:value="f.value"
              debounce="300"
            />
          </q-menu>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import AGInput from 'components/base/input.vue';
import { SearchIcon } from 'vue-tabler-icons';
export default {
  name: 'AGLocalFilters',
  props: ['filteredResults', 'settings', 'results'],
  components: { AGInput, SearchIcon },

  watch: {
    filters: {
      deep: true,
      handler() {
        this.filterResults();
      },
    },
    settings: {
      deep: true,
      handler() {
        this.filters = this.getFilters();
      },
    },
  },

  data() {
    return {
      filters: this.getFilters(),
    };
  },

  methods: {
    getFilters() {
      return cloneDeep(
        this.settings?.columns?.filter((v) => v.showLocalFilter) || []
      );
    },
    filterResults() {
      let filteredResults = cloneDeep(this.results);
      this.filters.forEach((f) => {
        if (!this.results) {
          return;
        }
        const index = this.results.columns.indexOf(f.name);
        if (index < 0) {
          return;
        }
        if (f.value == '' || f.value === undefined || f.value === null) {
          return;
        }
        filteredResults.rows = filteredResults.rows.filter((row) => {
          return this.match(row[index], f.value);
        });
      });

      this.$emit('update:filteredResults', filteredResults);
    },

    match(str, value) {
      try {
        return str.toString().toLowerCase().match(value.toLowerCase());
      } catch (e) {
        return false;
      }
    },
  },
};
</script>
