<template>
  <div class="tw-bg-white tw-rounded-sm tw-shadow-sm">
    <div class="tw-flex tw-p-2 tw-items-center tw-gap-2 tw-flex-nowrap tw-w-full">
      <div class="tw-py-1 tw-flex tw-divide-x tw-gap-2 tw-justify-start tw-items-center" :class="rawQuery || !table ? 'tw-flex-1' : ''"> 
        <AGDBSelector v-model:selectedDatabase="database" />
        <AGTableSelector v-model:selectedTable="table" v-if="!rawQuery && database" :database="database"  /></div>
      <QBHorizontalLayout :columns="columns" 
        :colDetails="colDetails"
        class="tw-flex-1" v-model:queryTerms="queryTerms" naked=true v-if="!rawQuery && table">
      </QBHorizontalLayout>
      <div class="tw-justify-self-end tw-flex tw-items-center tw-gap-2">
        <span class="tw-cursor-pointer tw-border tw-flex tw-items-center tw-leading-4  tw-py-1 tw-px-1.5 tw-rounded-sm tw-mx-0.5 tw-border-default/20 tw-bg-secondary tw-text-default" v-if="!rawQuery" @click="((rawQuery = !rawQuery) || true) && (resizeKey += 1)" ><CodeIcon size="16"  /></span>
        <span class="tw-cursor-pointer tw-border tw-flex tw-items-center tw-leading-4  tw-py-1 tw-px-1.5 tw-rounded-sm tw-mx-0.5 tw-border-default/20 tw-bg-secondary tw-text-default" v-if="rawQuery" @click="rawQuery = !rawQuery" ><BoxModel2Icon size="16" /></span>
        <span class="tw-cursor-pointer tw-border tw-flex tw-items-center tw-leading-4  tw-py-1 tw-px-1.5 tw-rounded-sm tw-mx-0.5 tw-border-default/20 tw-bg-primary tw-text-default" v-if="!rawQuery && database && table" @click="(updateQuestionHumanSql() || true ) && (this.$emit('runQuery'))" ><PlayerPlayIcon class="tw-stroke-white" size="16"  /></span>
      </div>
    </div>

    <VueResizable class="!tw-w-full" h=700 minH=500 :active="['b']" @resize:move="resizeKey += 1" @mount="resizeKey += 1" v-if="rawQuery">
      <div class="tw-h-full tw-bg-white tw-rounded-sm tw-shadow-sm tw-border-t" >
        <splitpanes class="pane-wrapper default-theme tw-flex !tw-h-full tw-transition-none" ref="chart-parent"
          @resize="((editorSize = 100 - $event[0].size) || true) && (resizeKey += 1)" @ready="resizeKey += 1" >
          <pane :size="25" class="pane !tw-overflow-y-auto pane-left " >
            <AGDbTree class="tw-h-full tw-bg-white" :database="database" v-model:tableList="tableList" @pasteAtCursor="v => pasteAtCursor = v"/>
          </pane>
          <pane :size="editorSize" ref="chart" class="pane pane-right tw-shadow-sm !tw-border" >
            <AGSQLEditor :databaseID="database?.id" :tableList="tableList" v-model:pasteAtCursor="pasteAtCursor" v-model:code="code" @runQuery="(updateQuestionHumanSql() || true ) && (this.$emit('runQuery'))" :key="resizeKey"/>
            <div class="note tw-py-2 tw-float-right tw-px-2 tw-w-fit">Please use Ctrl/Cmd + Enter to run query. Use Ctrl + P to checkout more editor commands </div>
          </pane>
        </splitpanes>
      </div>
    </VueResizable>
    <div class="tw-flex tw-items-center tw-justify-center tw-p-2 tw-border-t-2 tw-border-primary" v-if="rawQuery"  >
      <AGButton class="tw-bg-primary tw-text-white tw-py-2 tw-flex tw-gap-1 tw-items-center !tw-rounded" @click="(updateQuestionHumanSql() || true ) && (this.$emit('runQuery'))" >
        Get Results
        <ArrowRightIcon size="16" />
      </AGButton>
    </div>
  </div>
</template>
<script>
import AGDbTree from 'components/question/dbTree.vue'
import AGSQLEditor from 'components/question/sqlEditor.vue'
import AGDBSelector from 'components/question/dbSelector.vue'
import AGTableSelector from 'components/question/tableSelector.vue'
import QBHorizontalLayout from 'components/queryTerms/layout.vue'
import AGButton from 'components/base/button.vue'

import { Splitpanes, Pane } from 'splitpanes'
import {ArrowRightIcon, BoxModel2Icon, CodeIcon, PlayerPlayIcon} from 'vue-tabler-icons'

import {getColumns} from 'src/apis/database'
import {sessionStore} from 'src/stores/session'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import VueResizable from 'vue-resizable'

const datatypeMapping = {
  'bigint' : 'number',
  'bigserial' : 'number',
  'bit' : 'number',
  'bit' : 'number',
  'boolean' : 'boolean',
  'date' : 'datetime',
  'double' : 'number',
  'integer' : 'number',
  'numeric' : 'number',
  'real' : 'number',
  'smallint' : 'number',
  'smallserial' : 'number',
  'serial' : 'number',
  'time without time zone' : 'datetime',
  'time ' : 'datetime',
  'timestamp without time zone' : 'datetime',
  'timestamp' : 'datetime',
}

const session = sessionStore() 
export default {
  name: 'AGQuestionEditor',
  components: {AGDbTree, AGSQLEditor, AGDBSelector, AGTableSelector, QBHorizontalLayout, AGButton, ArrowRightIcon, CodeIcon, BoxModel2Icon, PlayerPlayIcon, VueResizable, Splitpanes, Pane},

  props: ['question'],

  watch: {
    code(){
      this.$emit('update:code', this.code)
      this.updateQuestionHumanSql()
    },
    database: {
      deep: true,
      handler(){
        this.updateQuestionHumanSql()
      }

    },
    rawQuery: {

      deep: true,
      handler(){
        this.updateQuestionHumanSql()
        setTimeout(() => {
          this.resizeKey += 1  
        }, 500);
      }
    },
    queryTerms: {
      deep: true,
      handler(){
        this.updateQuestionHumanSql()
      }
    },
    table: {
      deep: true,
      handler(){
        if (this.table?.id){
          getColumns(this.table.id, session.token, this.setColumns)
          this.updateQuestionHumanSql()
        }
      }
    },

    question: {
      deep: true,
      handler(){
        if (!isEqual(this.code ,  (this.question?.human_sql?.rawQuery || ""))){
          this.code = this.question?.human_sql?.rawQuery || ""
        }
        if (!isEqual(this.database,  this.question?.human_sql?.database)){
          this.database =  this.question?.human_sql?.database
        }
        if (!isEqual(this.table ,  this.question?.human_sql?.table)){
          this.table =  this.question?.human_sql?.table
        }
        if (!isEqual(this.rawQuery , (this.question?.query_type === 'sql'))){
          this.rawQuery = this.question?.query_type === 'sql'

        }
        if (!isEqual(this.queryTerms,  this.makeQueryTerms())){
          this.queryTerms = this.makeQueryTerms()
        }

      }
    }
  },


  mounted(){
    if (this.table?.id){
      getColumns(this.table.id, session.token, this.setColumns)
    }
    setTimeout(() => {
      this.resizeKey += 1  
    }, 500);
  },

  data(){
    return {
      tableList: [],
      pasteAtCursor: null,
      code: this.question?.human_sql?.rawQuery || "",
      columns: [],
      queryTerms: this.makeQueryTerms(),
      colDetails: {},
      rawQuery: this.question?.query_type === 'sql' ,
      table: this.question?.human_sql?.table,
      database: this.question?.human_sql?.database,
      resizeKey: 0,
      editorSize: 100,
    }
  },

  methods: {
    makeQueryTerms(){
      return {
        details: {
          filters: this.question?.human_sql?.filters || {details: []},
          groupings: this.question?.human_sql?.groupings || {details: []},
          sortings: this.question?.human_sql?.sortings || {details: []},
          views: this.question?.human_sql?.views || {details: []},
          limit: this.question?.human_sql?.limit,
          offset: this.question?.human_sql?.offset,
        }
      }
    },
    setColumns(table, loading){
      this.columns = table && table?.columns?.map(c => c.name) || []
      this.colDetails = {}
      table && table?.columns?.forEach(c => {
        this.colDetails[c.name] = {data_type: datatypeMapping[c.data_type] || 'text' }
      })
      this.loading = loading
    },

    updateQuestionHumanSql(){
      const humanSQL = {...this.queryTerms?.details, database: this.database, table: this.table, queryType: this.rawQuery ? 'raw' : 'query_builder', rawQuery: this.code, version: 1 } 
      let question = cloneDeep(this.question || {})
      question.human_sql = humanSQL
      question.query_type = (this.rawQuery ? 'sql' : 'human_sql')
      question.human_sql.queryType = (this.rawQuery ? 'raw' : 'query_builder')
      this.$emit('update:question', question )
    }
  }
}
</script>
