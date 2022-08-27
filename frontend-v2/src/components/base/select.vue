<template>
    <div
        class="tw-text-primary tw-grid tw-grid-cols-12 tw-bg-white tw-w-full tw-border-primary tw-border tw-rounded tw-text-ellipsis ">

        <q-menu transition-show="scale" transition-hide="scale" max-height="400px" :offset="[0, 5]" anchor="top right"
            self="bottom right" class="tw-rounded tw-shadow-sm tw-border" @show="menuShow" @keydown="onKeydown">
            <AGInput :value="query" @inputed="(val) => query = val" ref="option_0" tabindex="0" class="tw-p-2" />
            <div class="card tw-py-1">
                <a href="#" v-close-popup @click="select(el)" :tabindex="index + 1"
                    class="tw-border-b tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white"
                    v-for="el, index in optionsLocal" :key=el :ref="'option_' + (index + 1)" >
                    {{ el }}
                </a>
                <div class="tw-border-b tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis"
                    v-if="optionsLocal && optionsLocal.length === 0">
                    No Results
                </div>
            </div>
        </q-menu>
        <div
            class="tw-text-white tw-px-2 tw-col-span-4 tw-rounded-l tw-border tw-border-primary tw-align-middle tw-bg-primary tw-text-ellipsis tw-overflow-hidden tw-whitespace-nowrap">
            {{ label }}
        </div>
        <div class="tw-text-default tw-px-2 tw-col-span-8 tw-text-ellipsis tw-overflow-hidden tw-whitespace-nowrap">
            {{ modelValueLocal || description }}
        </div>
    </div>
</template>

<script>
import AGInput from 'components/base/input.vue';
export default {
    name: 'AGSelect',
    props: ['options', 'label', 'description'],

    components: { AGInput },

    data() {
        return { optionsLocal: [... this.options], modelValueLocal: '', query: "", focusPointer: -1 }
    },

    watch: {
        query(q) {
            if (!q || q === '') {
                this.optionsLocal = [...this.options]
                return
            }
            this.optionsLocal = [...this.options].filter((item) => {
                return item.toLowerCase().indexOf(q.toLowerCase()) >= 0
            })
        }
    },


    methods: {
        select(value) {
            this.modelValueLocal = value;
            this.$emit('select', value)
        },
        menuShow() {
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
                this.$refs['option_0'].$el.children[0].focus()
                return
            }
            this.$refs['option_' + this.focusPointer][0].focus()
        }
    }
}
</script>
