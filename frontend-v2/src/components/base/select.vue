<template>

        <span class="tw-text-white   tw-flex tw-flex-nowrap">

                <a href="#" :class="selected ? 'btn-left' : 'btn-full'">
                        {{ label }}
                        <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px"
                                :offset="[0, 5]" class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
                                @show="menuShow = true" @hide="menuShow = false" @keydown="onKeydown">
                                <SelectOptions :options="options" :selected="selected" :menuShow="menuShow"
                                        @select="(val) => $emit('select', val)" />
                        </q-menu>
                </a>
                <a href="#" v-if="selected" class="btn-center">
                        {{ selected || description }}
                        <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px"
                                :offset="[0, 5]" class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
                                @show="menuShow" @keydown="onKeydown">
                        <SelectOptions :options="options" :selected="selected" :menuShow="menuShow" :multiselect="multiselect"
                                @select="(val) => $emit('select', val)" />
                        </q-menu>
                </a>
                <a href="#" v-if="selected" class="btn-right">
                        <XMarkIcon class="tw-w-5 tw-h-5 tw-inline tw-stroke-white tw-mt-[-1px] " v-if="selected"
                                @click="(event) => (event.stopPropagation() || true) && $emit('select', null)" />
                </a>

        </span>

</template>

<script>
import SelectOptions from 'components/base/selectOptions.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
        name: 'AGSelect',
        props: ['options', 'label', 'description', 'selected', 'multiselect'],

        components: { XMarkIcon, SelectOptions },

        data() {
                return {
                        menuShow: false,
                }
        }




}
</script>
