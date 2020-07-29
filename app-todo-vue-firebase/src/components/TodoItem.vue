<template>
    <div class="todo-item">
      <div class="todo-item-left">
            <input type="checkbox" v-model="completed" @change="saveTodo">
            <div v-if="!editing" @dblclick="editTodo" class="todo-item-label" :class="{completed:completed}">{{title}}</div>
            <input v-else class="todo-item-edit" type="text" v-model="title" @blur="saveTodo" 
            @keyup.enter="saveTodo" @keyup.escape="cancelEdit">
        </div>
        <div>
            <button @click="pluralize">Plural</button>
             <span class="remove-item" @click="removeItem(id)">
                 &times;
             </span>
        </div>
            
    </div>
</template>
<script>
export default {
    name:'todo-item',
    props:{
        todo:{
            type:Object,
            required:true,
        },
        checkAll:{
            type:Boolean,
            required:true,
        }
    },
    data() {
        return {
            'id':this.todo.id,
            'title':this.todo.title,
            'completed':this.todo.completed,
            'editing':this.todo.editing,
            'beforeEditCache':'',
        }
    },
    watch: {
     checkAll(){
        this.completed=this.checkAll?true:this.todo.completed
     },
     todo(){
         this.title=this.todo.title
         this.completed=this.todo.completed
     }
   },
   created(){
      eventBus.$on('pluralize',this.handlePluralize)
   },
   beforeDestroy() {
       eventBus.$off('pluralize',this.handlePluralize)
   },
    methods: {
        removeItem(id){
            this.$store.dispatch('removeItem',id)
        },
        editTodo(){
           this.beforeEditcache=this.title
           this.editing=true
        },
        saveTodo(){
           if(this.title.trim().length==0){
              this.title=this.beforeEditcache
           }
           this.editing=false
           this.$store.dispatch('saveTodo',{
               'id':this.id,
               'title':this.title,
               'completed':this.completed,
               'editing':this.editing,
           })
        },
        cancelEdit(){
           this.title=this.beforeEditcache
           this.editing=false
        },
        pluralize(){
            eventBus.$emit('pluralize')
        },
        handlePluralize(){
           this.title=`${this.title}s`
           let index=this.$store.state.todos.findIndex(item=>item.id==this.id)
           this.$store.state.todos.splice(index,1,{
               'index':this.index,
               'todo':{
                   'id':this.id,
                   'title':this.title,
                   'completed':this.completed,
                   'editing':this.editing,
               }
           })
        },
    },
}
</script>