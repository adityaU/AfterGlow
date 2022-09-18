<template>

    <a href="#"
        class="">

        <q-menu transition-show="scale" class="tw-overflow-auto" transition-hide="scale" auto-close=true max-height="70vh">
            <div class="card tw-p-2">
                <div class="tw-my-2" v-for="arr in colors" :key=arr>
                    <div class="tw-box-content tw-mx-0.5 tw-inline tw-border-4 tw-border-secondary/20 tw-px-2.5 tw-rounded"
                        :class="selectedColor == color ? 'tw-border-primary' : ''"
                        :style="{ 'color': color, 'background-color': color }" @click="selectColor(color)"
                        v-for="color in arr" :key="color" v-close-popup>
                    </div>
                </div>
                <AGButton label="More Colors" @clicked="moreColors" />
            </div>
        </q-menu>
        <span :class="selectedColor ? 'btn-left' : 'btn-full'" >
            {{ label }}
        </span>
        <span v-if="selectedColor" class="btn-right"
            :style="{ 'color': selectedColor, 'background-color': selectedColor }">
            c
        </span>
    </a>
</template>

<script>
import { chunks } from '../../helpers/arrayUtils.ts';
import { generateColors, defaultColors } from '../../helpers/colorGenerator.ts';
import AGButton from 'components/base/button.vue';
export default {
    name: 'ColorSelector',

    props: {
      selectedColor: { default: defaultColors[0] }, label: {default: 'color'} },

    components: { AGButton },

    data() {
        const colors = chunks(generateColors(16), 8);
        return {
            colors: colors,
            colorCount: 16,
        }
    },

    methods: {
        moreColors() {
            this.colorCount += 16
            this.colors = chunks(generateColors(this.colorCount), 8)
        },
        selectColor(color) {
            this.$emit('selectColor', color)
        }
    }

}
</script>
