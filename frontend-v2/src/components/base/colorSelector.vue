<template>
        <div>

                <div class="label tw-mb-1" v-if="!naked">
                        {{ label }}
                </div>
                <a href="#" class="">

                        <q-menu transition-show="scale" class="tw-overflow-auto" transition-hide="scale" auto-close=true
                                max-height="70vh">
                                <div class="card tw-p-2">
                                        <div class="tw-my-2" v-for="arr in colors" :key=arr>
                                                <a href="#"
                                                        class="tw-box-content tw-mx-0.5 tw-inline tw-border-4 tw-border-secondary/20 tw-px-2.5 tw-rounded"
                                                        :class="selectedColor == color ? 'tw-border-primary' : ''"
                                                        :style="{ 'color': color, 'background-color': color }"
                                                        @click="selectColor(color)" v-for="color in arr" :key="color"
                                                        v-close-popup>
                                                </a>
                                        </div>
                                        <AGButton @clicked="moreColors">More Colors</AGButton>
                                </div>
                        </q-menu>

                        <span class="btn-full tw-border-4 tw-rounded tw-border-secondary/20 padding-top-[1px]"
                                :style="{ 'color': selectedColor, 'background-color': selectedColor }">
                                c
                        </span>
                </a>
        </div>
</template>

<script>
import { chunks } from '../../helpers/arrayUtils.ts';
import { generateColors, defaultColors } from '../../helpers/colorGenerator.ts';
import AGButton from 'components/base/button.vue';
export default {
        name: 'ColorSelector',

        props: {
                selectedColor: { default: defaultColors[0] }, label: { default: 'color' }, naked: { default: false }, additionalColors: { default: [] },
        },

        components: { AGButton },

        data() {
                const colors = chunks(generateColors(16), 8);
                return {
                        colors: [(this.additionalColors || []), ...colors],
                        colorCount: 16,
                }
        },

        methods: {
                moreColors() {
                        this.colorCount += 16
                        this.colors = [(this.additionalColors || []), ...chunks(generateColors(this.colorCount), 8)]
                },
                selectColor(color) {
                        this.$emit('selectColor', color)
                        this.$emit('update:selectedColor', color)
                }
        }

}
</script>
