<template v-if="dataLoaded" >
  <table class="tw-text-default tw-border-collapse tw-w-full tw-border-t">
    <thead>
      <tr class="tw-text-left tw-py-2 tw-text tw-leading-10 tw-bg-secondary tw-text-default/80 ">
        <th class="tw-px-4 tw-text-auto tw-uppercase" v-for="column in columns" :key="column">{{ column }}</th>
      </tr>

    </thead>
    <tbody>
      <tr class="tw-py-2 tw-border tw-border-default/20 even:tw-bg-grey-50" v-for="row in rows" :key="row">
        <td class=" tw-leading-10  tw-px-4" v-for="el in row" :key="el">{{ el }}</td>
      </tr>

    </tbody>

  </table>

  <div class="pagination tw-my-7">
    <a href="#" :class="[pageNumber === 1 ? arrowButtonsDisabledClass : arrowButtonsClass]"
      @click="decrementPageNumber">
      <ArrowSmLeftIcon class="tw-h-5 tw-w-5 tw-inline" />
    </a>
    <a href="#"
      :class="[pageNumber === displayPageNumberStart + n - 1 ? pageNumberButtonsActiveClass : pageNumberButtonsClass]"
      @click="setPageNumber(n)" v-for="n in totalPageNumbers" :key="n">
      {{ this.displayPageNumberStart + n - 1 }}
    </a>

    <a href="#" :class="[pageNumber === lastPageNumber ? arrowButtonsDisabledClass : arrowButtonsClass]"
      @click="increamentPageNumber">
      <ArrowSmRightIcon class="tw-h-5 tw-w-5 tw-inline" />
    </a>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/vue/outline'

export default defineComponent({

  name: 'AGTable',
  components: { ArrowSmRightIcon, ArrowSmLeftIcon },

  props: ['results'],

  data() {
    return {
      lastPageNumber: this.lastPageNumber,
      displayPageNumberStart: this.displayPageNumberStart,
      displayPageNumberEnd: this.displayPageNumberEnd,
      rows: this.rows,
      columns: this.columns,
    }
  },

  watch: {
    results: function () {
      this.updateProps()
    },
  },

  emits: ['update:pageNumber'],
  methods: {

    setPageNumber(index) {
      this.pageNumber = this.displayPageNumberStart + index - 1
      this.updateProps()
    },
    decrementPageNumber() {
      if (this.pageNumber > 1) {
        this.pageNumber -= 1
        this.updateProps()
      }
    },
    increamentPageNumber() {
      if (this.lastPageNumber != this.pageNumber) {
        this.pageNumber += 1
        this.updateProps()
      }
    },
    updateProps() {
      let r = this.results
      if (r) {
        this.rows = r.data.rows.slice(((this.pageNumber - 1) * this.pageSize) + 1, this.pageNumber * this.pageSize + 1);
        this.columns = r.data.columns


        this.lastPageNumber = +Math.ceil(r.data.rows.length / this.pageSize)
        this.displayPageNumberStart = this.pageNumber - 5 > 0 ? this.pageNumber - 5 : 1
        if (this.pageNumber < 6) {
          this.displayPageNumberEnd = this.lastPageNumber > 10 ? 10 : this.lastPageNumber
        } else {
          this.displayPageNumberEnd = this.pageNumber + 4 < this.lastPageNumber ? this.pageNumber + 4 : this.lastPageNumber
        }

        if ((this.displayPageNumberEnd - this.displayPageNumberEnd) < 9) {
          this.displayPageNumberStart = this.displayPageNumberEnd - 9
        }
        if (this.displayPageNumberStart < 1) {
          this.displayPageNumberStart = 1
        }


        this.totalPageNumbers = this.displayPageNumberEnd - this.displayPageNumberStart + 1

      }
    }
  },

  mounted() {
    this.updateProps()
  },

  setup() {
    const pageSize = 10;
    const paginationButtonClass = 'tw-border tw-border-primary hover:tw-bg-primary hover:tw-text-tertiary tw-mx-1 tw-py-2 tw-rounded'
    const paginationButtonDisabledClass = 'tw-border tw-border-default/20 hover:tw-bg-default/20 tw-mx-1 tw-py-2 tw-text-default/50 tw-rounded'

    let arrowButtonsClass = paginationButtonClass + ' tw-text-primary tw-px-3'
    let arrowButtonsDisabledClass = paginationButtonDisabledClass + ' tw-px-3'

    let pageNumberButtonsClass = paginationButtonClass + ' tw-text-primary  tw-px-3'
    let pageNumberButtonsActiveClass = paginationButtonClass + ' tw-text-white tw-bg-primary tw-px-3'

    let pageNumber = 1

    return {
      pageSize, paginationButtonClass, paginationButtonDisabledClass,
      arrowButtonsClass, arrowButtonsDisabledClass, pageNumberButtonsClass,
      pageNumberButtonsActiveClass, pageNumber
    }
  }
})
</script>
