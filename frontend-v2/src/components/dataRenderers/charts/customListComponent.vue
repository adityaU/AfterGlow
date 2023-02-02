<style scoped>
.custom-list-grid-stack.static td {
  width: inherit;
}

</style>
<template>
  <div class="tw-w-full custom-component" ref="canvas">
    <template v-if="!(settings && settings.columns) || (settings && settings.columns && settings.columns.length === 0)">
      <div class="tw-flex tw-items-center tw-justify-center tw-h-full">
        Please Unhide columns/ Api Actions from settings to create a component. 
      </div>
    </template>
    <template v-else>
      <template v-if="showSettings">
      </template>
      <div class="tw-flex tw-flex-col">
        <AGLocalFilters :style="localFiltersStyle" v-model:filteredResults='filteredResults' :results="results" :settings="settings" />
        <div class="tw-flex tw-justify-center tw-pt-2 tw-text-2xl tw-h-full tw-items-center" v-if="pagedRows.length <= 0">
          No Results
          </div>

      <div class="tw-flex tw-relative tw-p-2 tw-flex-wrap custom-list-grid-stack static tw-pt-2" :style="outerContainerStyle" v-if="pagedRows.length > 0">
        <template v-for="row in pagedRows" :key="row">
          <div class="" :style="widgetStaticStyle">
          <div class="tw-relative" :style="relativeContainerStyle" >
            <div v-for="w in widgets" :key="{ wss: widgetStaticStyle, ws: widgetStyle(w)}" :style="widgetStyle(w)">
              <template v-if="!w.apiAction && w.show">
                <AGTDRenderer :colDetails="colDetails" :value="row[columnIndex(w.name)]" :columns="widgets" :index="index(w.name)"
                  showFilters=false isColumnObject=true noMenu=true cursor="normal"
                  :formattingSettings="w.formattingSettings"/>
              </template>
              <template  v-if="w.apiAction && w.show">
                <ApiActionLink :link="addVars(w, row)" :queryKey="queryKey" :settings="settings.widgets" :colDetails="colDetails" />
              </template>
            </div>
          </div>
          </div>
        </template>
      </div>
      <div class="pagination tw-my-7 tw-flex" v-if="lastPageNumber > 1" :style="pageNumbersStyle">
        <div class="tw-cursor-pointer" href="#" :class="[pageNumber === 1 ? arrowButtonsDisabledClass : arrowButtonsClass]"
          @click="decrementPageNumber">
          <ChevronsLeftIcon size=16 />
        </div>
        <div class="tw-cursor-pointer"        :class="[pageNumber === displayPageNumberStart + n - 1 ? pageNumberButtonsActiveClass : pageNumberButtonsClass]"
          @click="setPageNumber(n)" v-for="n in totalPageNumbers" :key="n">
          {{ this.displayPageNumberStart + n - 1 }}
        </div>

        <div class="tw-cursor-pointer" href="#" :class="[pageNumber === lastPageNumber ? arrowButtonsDisabledClass : arrowButtonsClass]"
          @click="increamentPageNumber">
          <ChevronsRightIcon size=16 />
        </div>

      </div>
          </div>
    </template>
  </div>
</template>
<script>
import AGTDRenderer from 'components/dataRenderers/charts/td/renderer.vue'
import ApiActionLink from 'components/apiActions/linkWithFormModal.vue'
import AGLocalFilters from 'components/dataRenderers/charts/localFilters.vue'
import {ChevronsLeftIcon, ChevronsRightIcon} from 'vue-tabler-icons'

import cloneDeep from 'lodash/cloneDeep'

const justifyStyles = {
  'start': 'flex-start',
  'end': 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'center': 'center'
}
const justifyStylesForPageNumbers = {
  'start': 'flex-start',
  'end': 'flex-end',
  'space-between': 'center',
  'space-around': 'center',
  'center': 'center'
}

export default {
  name: "AGCustomListComponent",
  props: ['results', 'showSettings', 'settings', 'queryKey', 'visualizationID', 'questionID', 'colDetails', 'onDashboard'],
  components: {ApiActionLink, AGTDRenderer, ChevronsRightIcon, ChevronsLeftIcon, AGLocalFilters},

  watch:{
    rows(){
      this.setPageProperties()
    },
    pageSize(){
      this.setPageProperties()
    }
  },

  computed: {
    rows(){
      return this.filteredResults && this.filteredResults.rows
    },
    localFiltersStyle(){
      if (!(this.settings && this.settings.formattingSettings)){return {}}
      let style =  {'justify-content': justifyStyles[this.settings.formattingSettings.justifyLocalFilters]}
      return style
    },
    outerContainerStyle(){
      if (!(this.settings && this.settings.formattingSettings)){return {}}
      let style =  {'justify-content': justifyStyles[this.settings.formattingSettings.justifyContainer]}
      style['gap'] = this.settings.formattingSettings.hasOwnProperty('gap') ? this.settings.formattingSettings.gap + 'rem': '2rem'  
      return style
    },
    pageNumbersStyle(){
      if (!(this.settings && this.settings.formattingSettings)){return {}}
      return {'justify-content': justifyStylesForPageNumbers[this.settings.formattingSettings.justifyContainer]}
    },
    canvasWidth(){
      return this.settings && this.settings.canvasWidth
    },
    widgets() {
      return (this.settings && this.settings.widgets) || []
    },
    createrContainerDim(){
      return (this.settings && this.settings.createrContainerDim) || {}
    },
    widgetStaticStyle(){
      let style =  cloneDeep((this.settings && this.settings.widgetStaticStyle) || {})
      delete style['width']
      delete style['height']
      return style
    },
    widgetContainerStyle(){
      return (this.settings && this.settings.widgetContainerStyle) || {}
    },
    relativeContainerStyle(){
      const style = cloneDeep((this.settings && this.settings.widgetStaticStyle) || {})
      return {width: style["width"] , height: style["height"]  , overflow: 'hidden'}
    },
    pageSize(){
      let  pageSize = this.settings && this.settings.formattingSettings && this.settings.formattingSettings.pageSize || 12
      pageSize =  this.rows.length < pageSize ? this.rows.length : pageSize
      return pageSize
    }
  },

  data(){

    const paginationButtonClass = 'tw-border-2 tw-leading-4 tw-m-auto tw-border-primary hover:tw-bg-primary hover:tw-text-tertiary tw-mx-1 tw-py-2 tw-rounded-sm'
    const paginationButtonDisabledClass = 'tw-border-2 tw-leading-4 tw-m-auto tw-border tw-border-default/20 hover:tw-bg-default/20 tw-mx-1 tw-py-2 tw-text-default/50 tw-rounded-sm'

    let arrowButtonsClass = paginationButtonClass + ' tw-text-primary tw-px-3'
    let arrowButtonsDisabledClass = paginationButtonDisabledClass + ' tw-px-3'

    let pageNumberButtonsClass = paginationButtonClass + ' tw-text-primary  tw-px-3'
    let pageNumberButtonsActiveClass = paginationButtonClass + ' tw-text-white tw-bg-primary tw-px-3'
    return {
      lastPageNumber: 0,
      displayPageNumberStart: 0,
      displayPageNumberEnd: 0,
      pageNumber: 1,
      pagedRows: [],
      pageNumberButtonsActiveClass: pageNumberButtonsActiveClass,
      pageNumberButtonsClass: pageNumberButtonsClass,
      arrowButtonsClass: arrowButtonsClass,
      arrowButtonsDisabledClass: arrowButtonsDisabledClass,
      filteredResults: this.results
    }
  },

  mounted(){
    this.setPageProperties()
  },


  methods: {
    decrementPageNumber() {
      if (this.pageNumber > 1) {
        this.pageNumber -= 1
        this.setPageProperties()
      }
    },
    increamentPageNumber() {
      if (this.lastPageNumber != this.pageNumber) {
        this.pageNumber += 1
        this.setPageProperties()
      }
    },
    setPageNumber(index) {
      this.pageNumber = this.displayPageNumberStart + index - 1
      this.setPageProperties()
    },
    setPageProperties(){
      const r = this.filteredResults
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

      this.pagedRows = this.rows.slice(((this.pageNumber - 1) * this.pageSize), this.pageNumber * this.pageSize)
    },
    index(columnName){
      return  this.widgets && this.widgets.map(w => w.name).indexOf(columnName)
    },
    columnIndex(columnName){
      return  this.filteredResults?.columns?.indexOf(columnName)
    },
    addVars(w, row){
      w = cloneDeep(w)
      w.vars = {cols: this.filteredResults.columns, row: row} 
      w.value = w.name
      return w
    },
    widgetStyle(w){
      const startHeight = this.createrContainerDim.minY
      const startWidth = this.createrContainerDim.minX
      return {position: 'absolute', width: (1/512)*w.w*this.canvasWidth +  "px", height: w.h*5 + "px", top: (w.y )*5 - startHeight  + "px", left: (w.x )*(1/512)*this.canvasWidth - startWidth + "px", overflow: 'hidden'}
    },
  },
}
</script>
<style scoped>
.pagination {
  padding: 0.5rem;
}
  .pagination > * :first-child(){
    margin: 0px;
  }
  .pagination > * :last-child(){
    margin: 0px;
  }
</style>

