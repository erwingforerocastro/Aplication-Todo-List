<template>
 <div>
     <input type="text" class="todo-input" placeholder="Que necesitas hacer" @keyup.enter="addTodo" v-model="newTodo">
     <transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
     <todo-item v-for="(todo,index) in todosFiltered" :key="todo.id" :todo="todo" :index="index" :checkAll="anyRemaining" 
     > </todo-item>
     </transition-group>
     <div class="extra-container"> 
         <todo-check-all :anyRemaining="anyRemaining"></todo-check-all>
         <todo-item-remaining  :remaining="remaining"></todo-item-remaining>
     </div>
     <div class="extra-container">
       <todo-filtered></todo-filtered>
       <div>
         <transition name="fade">
           <todo-clear-completed :showClearCompletedButton="showClearCompletedButton"></todo-clear-completed>
         </transition>
       </div>
    </div>
 </div>
</template>

<script>
import TodoItem from './TodoItem'
import TodoItemRemaining from './TodoItemRemaining'
import TodoCheckAll from './TodoCheckAll'
import TodoFiltered from './TodoFiltered'
import TodoClearCompleted from './TodoClearCompleted'
export default {
  name: 'todo-list',
  components:{
     TodoItem,
     TodoItemRemaining,
     TodoCheckAll,
     TodoFiltered,
     TodoClearCompleted
  },
  data () {
    return {
      newTodo:'',
      beforeEditcache:'',
      filter:'all',
      nextId:3,
      todos:[
        {
        'id':1,
        'title':'Finish Vue Screencast',
        'editing':false,
        'completed':false,
        },
        {
        'id':2,
        'title':'Take over world',
        'editing':false,
        'completed':false,
        },
        ]
    }
  },
  created(){
     eventBus.$on('removeItem',(index)=>this.removeItem(index))
     eventBus.$on('finishedEdit',(data)=>this.finishedEdit(data))
     eventBus.$on('checkAllTodos',(checked)=>this.checkAllTodos(checked))
     eventBus.$on('filterChanged',(filter)=>this.filter=filter)
     eventBus.$on('clearCompleted',()=>this.clearCompleted())
  },
  beforeDestroy() {
     eventBus.$off('removeItem',(index)=>this.removeItem(index))
     eventBus.$off('finishedEdit',(data)=>this.finishedEdit(data))
     eventBus.$off('checkAllTodos',(checked)=>this.checkAllTodos(checked))
     eventBus.$off('filterChanged',(filter)=>this.filter=filter)
     eventBus.$off('clearCompleted',()=>this.clearCompleted())
  },
  computed: {
      remaining(){
          return this.todos.filter(t => !t.completed).length
      },
      anyRemaining(){
          return this.remaining==0
      },
      todosFiltered(){
          if(this.filter=='all'){
             return this.todos
          }else if(this.filter=='active'){
             return this.todos.filter(t=>!t.completed)
          }else if(this.filter=='completed'){
             return this.todos.filter(t=>t.completed)
          }
      },
      showClearCompletedButton(){
          return this.todos.filter(t=>t.completed).length>0
      }
  },
  methods: {
    addTodo(){
    if(this.newTodo.trim().length==0){
            return 
      }
      this.todos.push({
        id:this.nextId,
        title:this.newTodo,
        completed:false,
        editing:false
      })
      this.newTodo=''
      this.nextId++
    },
    removeItem(index){
       let lastId=this.todos[this.todos.length-1].id
       if(this.todos[index].id==lastId){
           this.nextId=lastId
       }
       this.todos.splice(index,1)
    },
    finishedEdit(data){
       this.todos.splice(data.index,1,data.todo)
    },
    checkAllTodos(){
      this.todos.map(item=>{
          item.completed=event.target.checked
      }) 
    },
    clearCompleted(){
       this.todos=this.todos.filter(t=>!t.completed) 
    }
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
.todo-input{
    width: 100%;
    padding: 10px 18px;
    font-size: 18px;
    margin-bottom: 16px;
}
.todo-input:focus{
    outline: 0;
}
.todo-item{
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.remove-item{
    cursor: pointer;
    margin-left: 14px;
}
.remove-item:hover{
    color:black;
}
.todo-item-left {
    display: flex;
    align-items: center;
}
.todo-item-label {
    padding: 10px;
    border: 1px solid white;
    margin-left: 12px;
}
.todo-item-edit {
    font-size: 24px;
    color: #2c3e50;
    margin-left: 12px;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc; 
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
.todo-item-edit:focus{
    outline: none;
}
.completed {
    text-decoration: line-through;
    color: grey;
}
.extra-container {
   display: flex;
   align-items: center;
   justify-content: space-between;
   font-size: 16px;
   border-top: 1px solid lightgrey;
   padding-top: 14px;
   margin-bottom: 14px;
 }
button {
   font-size: 14px;
   background-color: white;
   appearance: none;
}
button:hover{
    background: lightgreen;
}
button:focus{
   outline: none; 
}
.active {
   background: lightgreen;
}
/* CSS Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
