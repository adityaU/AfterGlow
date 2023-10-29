<style scoped>
.input .placeholder {
  display: block;
}

.input:focus .placeholder {
  display: none;
}
</style>
<template>
  <div class="">
    <div class="label" v-if="label">
      {{ label }}
    </div>
    <div class="input-border group tw-rounded !tw-py-2 !tw-px-2" @click="focusOnInput">
      <div class="tw-px-2 tw-py-0.5">
        <q-menu flat=true transition-show="jump-down" transition-hide="jump-up" max-height="400px"
          class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown" fit>
          <SelectOptions :options="options" :selected="selectedLocal" :menuShow="menuShow" :multiselect="multiselect"
            :disableLocalSearch="disableLocalSearch" @select="(val) => select(val)" v-model:searchQuery="query" />
        </q-menu>
        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="tw-flex tw-flex-wrap tw-gap-1" v-if="selected && selected.length > 0">
            <div class="tw-flex tw-justify-center" v-for="value in selected" :key=value>
              <span class="tw-rounded-l-sm tw-text-white tw-py-0.5 tw-px-2"
                :class="validate(value) ? 'tw-bg-primary' : 'tw-bg-red-700'">
                {{ value }}
              </span>
              <span class="tw-rounded-r-sm tw-text-white tw-p-0.5 tw-cursor-pointer tw-flex tw-px-2"
                :class="validate(value) ? 'tw-bg-primary/80' : 'tw-bg-red-700/80'">

                <XIcon size=14 @click.stop="deselect(value)" class="tw-m-auto" />
              </span>
            </div>
          </div>
          <div class="" v-if="!selected || selected.length === 0">
            {{ description }}
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
import SelectOptions from 'components/base/selectOptions.vue';
import { XIcon } from 'vue-tabler-icons'

export default {
  name: 'AGSearchSelect',
  props: ['queryFunction', 'includeQuery', 'options', 'selectedValidator', 'label', 'description', 'selected', 'multiselect', 'canNotDeselect', 'disableLocalSearch'],

  components: { XIcon, SelectOptions, },

  watch: {
    query() {
      this.queryFunction(this.query)
    },
    selected() {
      this.selectedLocal = this.selected
    }
  },

  data() {
    return {
      menuShow: false,
      query: null,
      selectedLocal: this.selected || []
    }
  },

  methods: {
    validate(selected) {
      if (this.selectedValidator) {
        return this.selectedValidator(selected)
      }
      return true
    },
    deselect(value) {

      const index = this.selectedLocal.indexOf(value)
      if (index >= 0) {
        this.selectedLocal.splice(index, 1)

        this.$emit('update:selected', this.selectedLocal)
      }
    },

    select(val) {
      if (val && val.type) {
        return
      }
      val = val.split(',').map(e => e.trim())
      val.forEach((v) => {
        const index = this.selectedLocal.indexOf(v)
        if (index < 0) {
          this.selectedLocal.push(v)
        }
      })

      this.$emit('update:selected', this.selectedLocal)

    }
  }




}
</script>
