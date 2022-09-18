<template>
    <div @click="updateValLocal"
        class="">
        <span
            class="btn-left">
            {{ label }}
        </span>
        <a href="#" class="btn-right">
          {{valLocal ? 'Yes' : 'No'}}
        </a>
    </div>
</template>

<script>
export default {
    name: 'AGBool',
    props: ['val', 'label'],
    components: {},

    watch: {
        val() {
          this.valLocal = this.val
        }
    },

    methods: {
        updateValLocal() {
            this.valLocal = !this.valLocal
            this.$emit('updated', this.valLocal)
        }
    },

    data() {
        return {
            valLocal: this.val
        }
    }

}
</script>
