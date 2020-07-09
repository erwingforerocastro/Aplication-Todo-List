import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        filter: 'all',
        todos: [{
                'id': 1,
                'title': 'Finish Vue Screencast',
                'editing': false,
                'completed': false,
            },
            {
                'id': 2,
                'title': 'Take over world',
                'editing': false,
                'completed': false,
            },
        ]
    },
    getters: {
        remaining(state) {
            return state.todos.filter(t => !t.completed).length
        },
        anyRemaining(state, getters) {
            return getters.remaining == 0
        },
        todosFiltered(state) {
            if (state.filter == 'all') {
                return state.todos
            } else if (state.filter == 'active') {
                return state.todos.filter(t => !t.completed)
            } else if (state.filter == 'completed') {
                return state.todos.filter(t => t.completed)
            }
        },
        showClearCompletedButton(state) {
            return state.todos.filter(t => t.completed).length > 0
        }
    },
    mutations: {
        addTodo(state, todo) {
            state.todos.push({
                id: todo.id,
                title: todo.title,
                completed: false,
                editing: false
            })
        },
        clearCompleted(state) {
            state.todos = state.todos.filter(t => !t.completed)
        },
        changeFilter(state, filter) {
            state.filter = filter
        },
        checkAllTodos(state, checked) {
            state.todos.map(item => {
                item.completed = checked
            })
        },
        removeItem(state, id) {
            let index = state.todos.findIndex(item => item.id == id)
            state.todos.splice(index, 1)
        },
        saveTodo(state, todo) {
            let index = state.todos.findIndex(item => item.id == todo.id)
            state.todos.splice(index, 1, todo)
        }

    },
    actions: {
        addTodo(context, todo) {
            setTimeout(() => {
                context.commit('addTodo', todo)
            }, 1000)

        },
        clearCompleted(context) {
            context.commit('clearCompleted')
        },
        changeFilter(context, filter) {
            context.commit('changeFilter', filter)
        },
        checkAllTodos(context, checked) {
            context.commit('checkAllTodos', checked)
        },
        removeItem(context, id) {
            context.commit('removeItem', id)
        },
        saveTodo(context, todo) {
            context.commit('saveTodo', todo)
        }
    }
})