<template>
    <div>
        <button :class="{ active: filter == 'all' }" @click="changeFilter('all')">Todos</button>
        <button :class="{ active: filter == 'active' }" @click="changeFilter('active')">Activo</button>
        <button :class="{ active: filter == 'completed' }" @click="changeFilter('completed')">Completado</button>
      </div>
</template>
<script>
export default {
    name:"todo-filtered",
    computed:{
        filter(){
            return this.$store.state.filter
        }
    },
    methods: {
        changeFilter(state){
            this.$store.dispatch('changeFilter',state)
        }
    },
}
</script>