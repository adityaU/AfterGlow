<template>
        <a href="#" class="">
            <span class="label">
                {{ label }}
            </span>
            <BaseInput ref="input" class="tw-m-2 tw-inline tw-text-default" :value="value"
                @inputed="(val) => $emit('inputed', val)" :placeholder="placeholder" />
        </a>
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
