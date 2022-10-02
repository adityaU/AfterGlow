<template>
                <div class="label">
                {{label}}
                </div>
                <div class="input-border">
                <div class="tw-px-2 tw-py-0.5">
                        <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px"
                                :offset="[0, 5]" class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
                                @show="menuShow" @keydown="onKeydown" auto-close>
                        <SelectOptions :options="options" :selected="selected" :menuShow="menuShow" :multiselect="multiselect"
                                @select="(val) => $emit('select', val)" :areOptionObjects="areOptionsObject" />
                        </q-menu>
                        <div class="tw-grid-cols-12 tw-grid">
                        <div class="tw-col-span-11" v-if="areOptionsObject">
                        {{ displaySelected }}
                        </div>
                        <div class="tw-col-span-11" v-if="!areOptionsObject">
                        {{ selected || description }}
                        </div>
                        <div class="tw-col-span-1 tw-text-right">
                        <XMarkIcon class="tw-w-5 tw-h-5 tw-inline tw-mt-[-1px] " v-if="selected"
                                @click="(event) => (event.stopPropagation() || true) && $emit('select', null)" />
                        </div>

                        </div>
                </div>

                </div> 


</template>

<script>
import SelectOptions from 'components/base/selectOptions.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
        name: 'AGSelect',
        props: ['options', 'label', 'description', 'selected', 'multiselect', 'areOptionsObject'],

        components: { XMarkIcon, SelectOptions },

        computed: {
        displaySelected(){
          if (!this.selected){
            return this.description
          }
          return this.options.filter((o) => o.value === this.selected)[0].name
        }
        },

        data() {
                return {
                        menuShow: false,
                }
        }




}
</script>
