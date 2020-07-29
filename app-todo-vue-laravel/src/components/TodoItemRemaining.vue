<template>
    <div>{{remaining}} faltantes</div>
</template>
<script>
export default {
    name:"todo-item-remaining",
    computed: {
        remaining(){
            return this.$store.getters.remaining
        }
    },
}
</script>