<template>
        <div class="tw-ml-[-10px]">
                <q-toggle :modelValue="valLocal" @update:modelValue="updateValLocal" color="primary" :label="label" />
        </div>
</template>

<script>
export default {
        name: 'AGBool',
        props: ['val', 'label', 'value'],
        components: {},

        watch: {
                val() {
                        this.valLocal = this.val || this.value
                }
        },

        methods: {
                updateValLocal() {
                        this.valLocal = !this.valLocal
                        this.$emit('updated', this.valLocal)
                        this.$emit('update:val', this.valLocal)
                        this.$emit('update:value', this.valLocal)
                }
        },

        data() {
                const valLocal = typeof(this.value) === 'string' ? (this.value === 'true') : this.value
                return {
                        valLocal: this.val || valLocal || false
                }
        }

}
</script>
