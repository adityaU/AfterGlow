<template>
  <teleport to="body">

    <AGModal class="!tw-fixed" size="small" :show="open" @update:show="(val) => $emit('update:show', val)" :loading="loading"
      :loadingMessage="loadingMessage">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">
          Add Tags
        </div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y">
          <div class="note">Tip: You can create new tags by typing the name of tag in search of select box and then clicking add from dropdown</div>
          <div class="tw-flex input-border tw-flex-wrap tw-px-2 tw-py-1 tw-gap-2">
            <div class="tw-flex tw-justify-center tw-flex-nowrap" v-for="tag in tagsLocal" :key="tag">
              <span class="tw-rounded-l-sm tw-text-white tw-py-0.5 tw-px-2" :style="{'background-color' : tag.color , 'color' : autoTextColor(tag.color)}">
                {{tag.name}}
              </span>
              <span class="tw-rounded-r-sm tw-p-0.5 tw-cursor-pointer tw-flex tw-px-2 tw-opacity-80" :style="{'background-color' : tag.color, 'color' : autoTextColor(tag.color)}" >
                <XIcon size=14 @click.stop="select(tag)" class="tw-m-auto" />
              </span>
            </div>
            <div class="" v-if="!tagsLocal || tagsLocal?.length === 0">
              Select Tags 
            </div>

            <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="800px" 
              class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown" fit>
              <SelectOptions :options="allTags" :selected="tagsLocal" :menuShow="menuShow" iconLetter="D"
                displayKey="name" areOptionObjects="true" multiselect=true @select="(v) => select(v) " v-model:searchQuery="q"/>
              <div class=" tw-cursor-pointer group tw-flex tw-py-1 tw-px-2 tw-w-full hover:tw-bg-primary hover:!tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0" v-if="addTagOption" @click="addTag">
                Add Tag - {{addTagOption.name}} 
              </div>
            </q-menu>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="$emit('update:open', false)">
            Cancel
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            @clicked="($emit('save') || true) && $emit('update:open', false)">
            Save
          </AGButton>
        </div>
      </template>
    </AGModal>
  </teleport>

</template>
<script>
import AGModal from 'components/utils/modal.vue'
import AGButton from "components/base/button.vue"
import SelectOptions from "components/base/selectOptions.vue"
import isEqual from 'lodash/isEqual'


import {sessionStore} from 'stores/session'
import cloneDeep from 'lodash/cloneDeep'
import {fetchTags, createTag} from 'src/apis/tags'
import {fetchRecipients} from 'src/apis/recipients'
import {XIcon} from 'vue-tabler-icons'
import { autoTextColor } from 'src/helpers/colorGenerator'
export default {
  name: 'AGSharetags',
  components: {AGModal, AGButton, SelectOptions, XIcon},
  props: ["open","tags", "tagsName"],

  watch: {
    q() {
      if (!this.q){
        this.addTagOption = null
        return 
      }
      const allTagNames = this.allTags.map(t => t.name)
      if (allTagNames.indexOf('q') < 0){
        this.addTagOption  =  {
          name: this.q,
        }
      }else{
        this.addTagOption = null
      }
    },
    tagsLocal:{
      deep: true,
      handler(newv, oldv){
        this.$emit("update:tags", this.tagsLocal)
      }
    },
    tags:{
      deep: true,
      handler(newv, oldv){
        if (!isEqual(oldv, newv)){
          this.tagsLocal = this.tags
        }
      }
    }
  },
  data(){
    return {
      emailOptions: [],
      tagsLocal: cloneDeep(this.tags || {}),
      session: sessionStore(),
      allTags: [],
      q: "",
      addTagOption: null,
    }
  },

  mounted(){
    fetchTags(this.setAllTags)
  },

  methods: {
    autoTextColor(color){
      return autoTextColor(color)
    },
    setAllTags(tags, _loading ){
      this.allTags = tags
    },
    select(v){
      const selectedTags = this.tagsLocal.map(t => t.name)
      const index = selectedTags.indexOf(v.name) 
      if (index < 0){
        this.tagsLocal.push(v)
      }else{
        this.tagsLocal.splice(index, 1)
      }
    },
    updateAllTags(tag, _loading){
      if (tag){
        this.allTags.push(tag)
        this.select(tag)
      }
    },
    addTag(){
      createTag(this.addTagOption, this.updateAllTags)
    },
    searchTags(q){
      fetchRecipients(q, this.session.token, (emailOptions) => {
        this.emailOptions = emailOptions
        this.emailOptions.push(q)
      })
    },

  }
}
</script>
