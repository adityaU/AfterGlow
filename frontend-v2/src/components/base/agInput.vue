<template>
    <span class="">
        <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="100vh" anchor="bottom right"
            self="bottom right" class="menu" @show="menuShow" @keydown="onKeydown">
            <BaseInput ref="input" class="tw-m-2 tw-inline tw-text-default" :value="value"
                @inputed="(val) => $emit('inputed', val)" :placeholder="placeholder" invisible=true />
        </q-menu>
        <a href="#" class="">
            <span :class="value ? 'btn-left' : 'btn-full'">
                {{ label }}
            </span>
            <span v-if="value" class="btn-right">
                {{ value }}
            </span>
        </a>
    </span>

</template>

<script>
import BaseInput from "components/base/input.vue"
export default {
    name: 'AGInput',

    components: { BaseInput },
    props: ['label', 'placeholder', 'value'],

    methods: {
        menuShow() {
            this.$refs['input'].$el.focus()
        }
    }



}
</script>
