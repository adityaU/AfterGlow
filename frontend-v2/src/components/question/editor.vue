<template>
  <div class="tw-bg-white tw-m-2 tw-rounded-sm tw-shadow-sm">
    <div class="tw-flex tw-p-2 tw-items-center tw-gap-2 tw-flex-nowrap tw-w-full">
     <div class="tw-py-1 tw-flex tw-divide-x tw-gap-2 tw-justify-start tw-items-center" :class="rawQuery || !table ? 'tw-flex-1' : ''"> 
      <AGDBSelector v-model:selectedDatabase="database" />
      <AGTableSelector v-model:selectedTable="table" v-if="!rawQuery && database" :database="database"  /></div>
      <QBHorizontalLayout :columns="columns" 
        :colDetails="colDetails"
        class="tw-flex-1" v-model:queryTerms="queryTerms" naked=true v-if="!rawQuery && table">
      </QBHorizontalLayout>
      <div class="tw-justify-self-end">
        <span class="tw-cursor-pointer tw-border tw-flex tw-items-center tw-leading-4  tw-py-1 tw-px-1.5 tw-rounded-sm tw-mx-0.5 tw-border-default/20 tw-bg-secondary tw-text-default" v-if="!rawQuery" @click="rawQuery = !rawQuery" ><CodeIcon size="16"  /></span>
        <span class="tw-cursor-pointer tw-border tw-flex tw-items-center tw-leading-4  tw-py-1 tw-px-1.5 tw-rounded-sm tw-mx-0.5 tw-border-default/20 tw-bg-secondary tw-text-default" v-if="rawQuery" @click="rawQuery = !rawQuery" ><BoxModel2Icon size="16" /></span>
      </div>
    </div>
    <div class="tw-h-[500px] tw-bg-white tw-rounded-sm tw-shadow-sm tw-border-t" v-if="rawQuery">
      <div class="tw-flex tw-h-full item-3070-columns">
        <div class="tw-w-[25%]" > 
          <AGDbTree class="tw-h-full" :database="database" v-model:tableList="tableList" @pasteAtCursor="v => pasteAtCursor = v"/>
        </div>
        <AGSQLEditor class="tw-w-[75%]" :tableList="tableList" v-model:pasteAtCursor="pasteAtCursor" v-model:code="code"/>
      </div>
    </div>
      <div class="tw-flex tw-items-center tw-justify-center tw-p-2 tw-border-t-2 tw-border-primary"  >
      <AGButton class="tw-bg-primary tw-text-white tw-py-2 tw-flex tw-gap-1 tw-items-center !tw-rounded" @click="updateQuestionHumanSql" >
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

import {ArrowRightIcon, BoxModel2Icon, CodeIcon} from 'vue-tabler-icons'

import {getColumns} from 'src/apis/database'
import {sessionStore} from 'src/stores/session'
import cloneDeep from 'lodash/cloneDeep'

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
  components: {AGDbTree, AGSQLEditor, AGDBSelector, AGTableSelector, QBHorizontalLayout, AGButton, ArrowRightIcon, CodeIcon, BoxModel2Icon},

  props: ['question'],

  watch: {
    database(){
      this.table = null
      this.queryTerms = {}
    },
    table: {
      deep: true,
      handler(){
        if (this.table?.id){
          getColumns(this.table.id, session.token, this.setColumns)
        }
      }
    },
    question: {
      deep: true,
      handler(){
        this.code = this.question?.human_sql?.rawQuery || ""
        this.database =  this.question?.human_sql?.database
        this.table =  this.question?.human_sql?.table
      }
    }
  },


  mounted(){
    if (this.table?.id){
          getColumns(this.table.id, session.token, this.setColumns)
    }
  },

  data(){
    return {
      tableList: [],
      pasteAtCursor: null,
      code: this.questionLocal?.human_sql?.rawQuery || "",
      columns: [],
      queryTerms: {},
      colDetails: {},
      rawQuery: false,
      table: this.questionLocal?.human_sql?.table,
      database: this.questionLocal?.human_sql?.database
    }
  },

  methods: {
    setColumns(table, loading){
      this.columns = table && table?.columns?.map(c => c.name) || []
      this.colDetails = {}
      table && table?.columns?.forEach(c => {
        this.colDetails[c.name] = {data_type: datatypeMapping[c.data_type] || 'text' }
      })
      this.loading = loading
    },

    updateQuestionHumanSql(){
      const humanSQL = {...this.queryTerms?.details, database: this.database, table: this.table, queryType: this.rawQuery ? 'raw' : 'builder', rawQuery: this.code, version: 1 } 
      let question = cloneDeep(this.question)
      question.human_sql = humanSQL
      this.$emit('update:question', question )
      this.$emit('runQuery')
    }
  }
}
</script>
