<template>
 <div>
     <input type="text" class="todo-input" placeholder="Que necesitas hacer" @keyup.enter="addTodo" v-model="newTodo">
     <div v-if="$store.state.loading" class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
     <transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
     <todo-item v-for="todo in todosFiltered" :key="todo.id" :todo="todo" :checkAll="anyRemaining" 
     > </todo-item>
     </transition-group>
     <div class="extra-container"> 
         <todo-check-all/>
         <todo-item-remaining/>
     </div>
     <div class="extra-container">
       <todo-filtered></todo-filtered>
       <div>
         <transition name="fade">
           <todo-clear-completed/>
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
      nextId:3,
    }
  },
  created(){
    this.$store.dispatch('initRealtimeListeners')
    this.$store.dispatch('retrieveTodos')
  },
  updated() {
    this.nextId=this.$store.state.todos.reduce((acum,current)=>{
      if(acum<current.id){
        return acum=current.id
      }
    },0)+1;
  },
  beforeDestroy() {
  },
  computed: {
      remaining(){
          return this.$store.getters.remaining
      },
      anyRemaining(){
          return this.$store.getters.anyRemaining
      },
      todosFiltered(){
          return this.$store.getters.todosFiltered
      },
      showClearCompletedButton(){
          return this.$store.getters.showClearCompletedButton
      }
  },
  methods: {
    addTodo(){
      if(this.newTodo.trim().length==0){return}
      this.$store.dispatch('addTodo',{
        id:this.nextId,
        title:this.newTodo,
      })
      this.newTodo=''
      this.nextId++
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
/* css del spinner */
.lds-default {
  display: block;
  position: relative;
  width: 80px;
  height: 80px;
  margin:auto;
  margin-bottom: 16px;
}
.lds-default div {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #dfc;
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 37px;
  left: 66px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 22px;
  left: 62px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 11px;
  left: 52px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 7px;
  left: 37px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 11px;
  left: 22px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 22px;
  left: 11px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 37px;
  left: 7px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 52px;
  left: 11px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 62px;
  left: 22px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 66px;
  left: 37px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 62px;
  left: 52px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 52px;
  left: 62px;
}
@keyframes lds-default {
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}

</style>
