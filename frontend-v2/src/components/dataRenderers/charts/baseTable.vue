<template v-if="results" >
  <div class="tw-h-full tw-w-full">
    <slot :columns="columns" :rows="rows" v-if="rows && rows.length > 0" />

    <div class="pagination tw-my-7" v-if="lastPageNumber > 1">
      <a href="#" :class="[pageNumber === 1 ? arrowButtonsDisabledClass : arrowButtonsClass]"
        @click="decrementPageNumber">
        <ChevronsLeftIcon class="tw-h-5 tw-w-5 tw-inline" />
      </a>
      <a href="#"
        :class="[pageNumber === displayPageNumberStart + n - 1 ? pageNumberButtonsActiveClass : pageNumberButtonsClass]"
        @click="setPageNumber(n)" v-for="n in totalPageNumbers" :key="n">
        {{ this.displayPageNumberStart + n - 1 }}
      </a>

      <a href="#" :class="[pageNumber === lastPageNumber ? arrowButtonsDisabledClass : arrowButtonsClass]"
        @click="increamentPageNumber">
        <ChevronsRightIcon class="tw-h-5 tw-w-5 tw-inline" />
      </a>

    </div>

  </div>
</template>

<script>
import { ChevronsLeftIcon, ChevronsRightIcon } from 'vue-tabler-icons'


import _ from 'lodash'


const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

export default {

  name: 'AGTable',
  components: { ChevronsRightIcon, ChevronsLeftIcon, },

  props: ['results', 'showSettings', 'isTransposed', "settings"],

  data() {
    return {
      lastPageNumber: this.lastPageNumber,
      displayPageNumberStart: this.displayPageNumberStart,
      displayPageNumberEnd: this.displayPageNumberEnd,
      rows: this.rows,
      columns: this.columns,
      size: 20,
      settingsLocal: this.settings
    }
  },

  watch: {
    results() {
      this.updateProps()
    },
    columns(){
      this.updateProps()
    },
    settings: {
      handler() {
        this.updateProps(this.settings)
      },
      deep: true
    }
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
    updateProps(settings) {
      if (settings) {
        this.settingsLocal = _.cloneDeep(settings)
      }
      let r = this.results
      if (r) {
        let rows = []
        const settingsColumns = new Set(this.settingsLocal && this.settingsLocal.columns && this.settingsLocal.columns.map(item => item.name) || [])
        const columns = new Set(this.columns || []) 

        if (eqSet(settingsColumns, columns) && [...settingsColumns].length > 0) {
          let columnSettings = {}
          this.settingsLocal.columns.forEach((col, i) => {
            col['newOrder'] = i
            columnSettings[col.name] = col
          })
          let hiddenColumnIndices = this.settingsLocal.columns.map((item) => {
            return (item.show ? null : r.columns.indexOf(item.name))
          })

          this.columns = r.columns.filter((_, i) => {
            return hiddenColumnIndices.indexOf(i) < 0
          }).sort((a, b) => {

            return columnSettings[a].newOrder - columnSettings[b].newOrder

          })
          rows = r.rows.slice(((this.pageNumber - 1) * this.pageSize), this.pageNumber * this.pageSize).
            map((row) => {

              let newRow = []
              row.forEach((el, i) => {
                columnSettings[r.columns[i]] && (newRow[columnSettings[r.columns[i]].newOrder] = el)
              })
              return newRow
            }).
            map((row) => {
              return row.filter((el, i) => {
                return (Object.entries(columnSettings).filter((item) => { return (item[1] && item[1].newOrder) === i }))[0][1].show
              })
            });


        } else {
          rows = r.rows.slice(((this.pageNumber - 1) * this.pageSize), this.pageNumber * this.pageSize);
          this.columns = r.columns

        }

        if (this.isTransposed) {
          this.rows = this.columns.map((item, colIndex) => [item, ...rows.map(row => row[colIndex])])
        } else {
          this.rows = rows
        }




        this.lastPageNumber = +Math.ceil(r.rows.length / this.pageSize)
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
}
</script>
