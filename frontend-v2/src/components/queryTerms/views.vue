
<template>
  <floating-menu :items="viewsLocal" label="View" @clicked="(val) => newview.showMenu = true">
    <template #itemsSlot>
      <div class="tw-inline" v-for="view, index in viewsLocal" :key="view">

        <div class="tw-px-0.5 tw-py-1 tw-inline-flex tw-flex-nowrap">
          <ViewMenu @addView="prevent" addLabel="Done" @editView="(val) => view = val" :view="view" :columns="columns"
            :colDetails="colDetails" />
          <a href="#" class="btn tw-bg-primary tw-text-white hover:tw-bg-primary/80" v-for="dv, i in getDisplayValues(view)"
            :key="dv"
            :class="i === 0 ? 'btn-left' : 'btn-center'"
            @click="view.currentStage = dv[1]">{{
                dv[0]
            }}</a>
          <a href="#" class="btn btn-right" @click="removeView(index)">
            <XIcon class="tw-inline tw-h3 tw-w-3" size=18 />
          </a>
        </div>

      </div>
    </template>
    <template #menuSlot>
      <ViewMenu @addView="addView" @editView="(val) => newview = val" addLabel="Add view" :reset="reset"
        viewMenu="newView" :columns="columns" :colDetails="colDetails" :rows="rows" />
    </template>
  </floating-menu>

</template>

<script>



import FloatingMenu from 'components/base/floatingMultiSelect.vue'
import ViewMenu from 'components/queryTerms/viewMenu.vue'

import { XIcon } from 'vue-tabler-icons';

import {ViewMixin} from 'src/mixins/viewMixin'

import { _ } from 'lodash';
export default {

  name: 'AGviews',

  props: ['columns', 'colDetails', 'views'],
  mixins: [ViewMixin],

  components: { ViewMenu, FloatingMenu, XIcon },

  watch: {
    views(){
      if (this.views.towardsChild){
        this.viewsLocal = this.views.details
      }
    },
    viewsLocal: {
      deep: true,
      handler() {
        this.$emit('update:views', {towardsChild: false, details: this.viewsLocal})
      }
    }
  },

  data() {
    return {
      viewsLocal: this.views.details || [],
      reset: false,
      newView: null
    }
  },

  methods: {
    addView(view) {
      this.viewsLocal.push(view)
      this.reset = !this.reset
      return true 
    },

    removeView(index) {
      this.viewsLocal.splice(index, 1)
    }
  }

}
</script>
