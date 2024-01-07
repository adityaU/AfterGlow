<template>
  <floating-menu :items="groupingsLocal" label="Group By" @clicked="(val) => newgrouping.showMenu = true">
    <template #itemsSlot>
      <div class="tw-inline" v-for="grouping, index in groupingsLocal" :key="grouping">

        <div class="tw-px-0.5 tw-py-1 tw-inline-flex tw-flex-nowrap">
          <groupingMenu @addgrouping="prevent" addLabel="Done" @editgrouping="(val) => grouping = val"
            :grouping="grouping" :columns="columns" :colDetails="colDetails" />
          <div class="btn tw-bg-primary tw-text-white hover:tw-bg-primary/80 tw-cursor-pointer"
            v-for="dv, i in getDisplayValues(grouping, colDetails)" :key="dv" :class="i === 0 ? 'btn-left' : 'btn-center'"
            @click="grouping.currentStage = dv[1]">{{
              dv[0]
            }}</div>
          <div class="btn btn-right tw-cursor-pointer " @click="removegrouping(index)">
            <XIcon class="tw-inline tw-h3 tw-w-3" size=18 />
          </div>
        </div>

      </div>
    </template>
    <template #menuSlot>
      <GroupingMenu @addgrouping="addgrouping" @editgrouping="(val) => newgrouping = val" addLabel="Add Group by"
        :reset="reset" :grouping="newGrouping" :columns="columns" :colDetails="colDetails" />
    </template>
  </floating-menu>
</template>

<script>



import FloatingMenu from 'components/base/floatingMultiSelect.vue'
import GroupingMenu from 'components/queryTerms/groupingMenu.vue'

import { XIcon } from 'vue-tabler-icons';
import isEqual from 'lodash/isEqual'

import { GroupingMixin } from 'src/mixins/groupingMixin'

import { _ } from 'lodash';
export default {

  name: 'AGGroupings',

  props: ['columns', 'colDetails', 'groupings'],
  mixins: [GroupingMixin],

  components: { GroupingMenu, FloatingMenu, XIcon },

  data() {
    return {
      groupingsLocal: this.groupings?.details || [],
      reset: false,
      newgrouping: null
    }
  },

  watch: {
    groupings() {
      if (!isEqual(this.groupingsLocal, this.groupings.details)) {
        this.groupingsLocal = this.groupings.details
      }
    },
    groupingsLocal: {
      deep: true,
      handler() {
        this.$emit('update:groupings', { towardsChild: false, details: this.groupingsLocal })
      }
    }
  },
  methods: {
    addgrouping(grouping) {
      this.groupingsLocal.push(grouping)
      this.reset = !this.reset
      return true
    },

    removegrouping(index) {
      this.groupingsLocal.splice(index, 1)
    }
  }

}
</script>
