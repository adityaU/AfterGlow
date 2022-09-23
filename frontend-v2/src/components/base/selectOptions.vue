<template>
        <div class="" @keydown="onKeydown" tabindex="0">
        <div class="tw-py-1 tw-px-2">
                <BaseInput :value="query" @inputed="(val) => query = val" ref="option_0" class="tw-p-2" />
        </div>
        <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
                <a href="#" @click="select(el)" :tabindex="index + 1"
                        class="tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
                        v-for="el, index in optionsLocal" :key=el :ref="'option_' + (index + 1)" >
                        <span class="text-icon-primary" v-if="iconLetter"> {{iconLetter}} </span>
                        <span class="">{{ el }}</span>
                        <CheckIcon v-if="multiselect ? (selected.indexOf(el) >= 0) : (selected === el)"
                                class="tw-w-5 tw-h-5 tw-stroke-primary tw-inline tw-float-right" />
                </a>
                <div class="tw-border-b last:tw-border-none tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis"
                        v-if="optionsLocal && optionsLocal.length === 0">
                        No Results
                </div>
        </div>
        </div> 
</template>

<script>

import { CheckIcon } from '@heroicons/vue/24/outline'
import BaseInput from 'components/base/input.vue';
export default {
        name: 'AGSelectOptions',

        props: ['options', 'selected', 'menuShow', 'includeQuery', 'multiselect', 'iconLetter'],

        components: { CheckIcon, BaseInput },

        data() {
                console.log(this.multiselect)
                return { optionsLocal: [... this.options], query: "", focusPointer: -1 }
        },


        watch: {
                menuShow() {
                        this.menuShowFn()
                },
                query(q) {
                        if (!q || q === '') {
                                this.optionsLocal = [...this.options]
                                return
                        }
                        this.optionsLocal = [...this.options].filter((item) => {
                                return item.toLowerCase().indexOf(q.toLowerCase()) >= 0
                        })

                        if (this.includeQuery){
                          this.optionsLocal.push(q)
                        }
                }
        },
        methods: {
                select(value) {
                        this.$emit('select', value)
                },
                menuShowFn() {
                        this.focusPointer = 0
                        this.focus()
                },
                onKeydown(event) {
                        if (event.key == 'ArrowUp') {
                                this.focusPointer -= 1
                                if (this.focusPointer < 0) {
                                        this.focusPointer = this.optionsLocal.length
                                }
                                this.focus()

                        }

                        if (event.key == 'ArrowDown') {
                                this.focusPointer += 1
                                if (this.focusPointer > this.optionsLocal.length) {
                                        this.focusPointer = 0
                                }
                                this.focus()
                        }
                },
                focus() {
                        if (this.focusPointer === 0) {
                                this.$refs['option_0'].$el.focus()
                                return
                        }
                        this.$refs['option_' + this.focusPointer][0].focus()
                }
        }
}
</script>
