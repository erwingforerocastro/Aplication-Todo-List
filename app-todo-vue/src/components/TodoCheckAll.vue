<template>
    <div><label><input type="checkbox" :checked="anyRemaining" @change="checkAllTodos">Chequear todo</label></div>
</template>
<script>
export default {
    name:"todo-check-all",
    computed:{
        anyRemaining(){
            return this.$store.getters.anyRemaining
        }
    },
    methods: {
        checkAllTodos(){
            this.$store.dispatch('checkAllTodos',event.target.checked)
        },
    },
}
</script>