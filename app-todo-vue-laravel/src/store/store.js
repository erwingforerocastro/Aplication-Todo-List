import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

export const store = new Vuex.Store({
    state: {
        loading: true,
        token: localStorage.getItem('acess_token') || null,
        filter: 'all',
        todos: []
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
                timestamp: new Date(),
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
            if (index > 0) {
                state.todos.splice(index, 1)
            }
        },
        saveTodo(state, todo) {
            let index = state.todos.findIndex(item => item.id == todo.id)
            state.todos.splice(index, 1, todo)
        },
        retrieveTodos(state, todos) {
            state.todos = todos

        },
        retrieveToken(state, token) {
            state.token = token
        },
        logeedIn(state) {
            return state.token == null
        },
        destroyToken(state) {
            state.token = null
        }

    },
    actions: {
        addTodo(context, todo) {
            axios.post('/todos', {
                completed: false
            }).then(res => {
                context.commit('addTodo', res.data)
            }).catch(err => {
                console.log(err)
                context.commit('addTodo', {
                    id: docRef.id,
                    title: todo.title,
                    completed: false,
                })
            })

        },
        clearCompleted(context) {
            const completed = store.state.todos.filter(i => i.completed == true).map(i => i.id)

            axios.delete(`/todosDeleteAll/`, {
                    data: {
                        todos: completed
                    }
                })
                .then(res => {
                    context.commit('clearCompleted')
                }).catch(err => {
                    console.log(err)
                })
        },
        changeFilter(context, filter) {
            context.commit('changeFilter', filter)

        },
        checkAllTodos(context, checked) {

            axios.patch('/todosCheckAll', {
                completed: checked
            }).then(res => {
                context.commit('checkAllTodos', checked)
            }).catch(err => {
                console.log(err)
            })

        },
        removeItem(context, id) {

            axios.delete(`/todos/${id}`)
                .then(res => {
                    context.commit('removeItem', id)
                }).catch(err => {
                    console.log(err)
                })

        },
        saveTodo(context, todo) {
            axios.patch(`/todos/${todo.id}`, {
                title: todo.title,
                completed: todo.completed
            }).then(res => {
                context.commit('saveTodo', res.data)
            }).catch(err => {
                console.log(err)
            })

        },
        retrieveTodos(context) {
            axios.get('/todos').then(res => {
                context.commit('retrieveTodos', res.data)
            }).catch(err => {
                console.log(err)
            })
        },
        retrieveToken(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('/login', {
                    username: credentials.username,
                    password: credentials.password
                }).then(res => {
                    const token = res.data.acess_token
                    localStorage.setItem('acess_token', token)
                    context.commit('retrieveToken', token)
                    resolve(res)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })

        },
        destroyToken(context) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${context.state.token}`
            if (!context.getters.loggedIn) {
                return new Promise((resolve, reject) => {
                    axios.post('/logout')
                        .then(res => {
                            localStorage.removeItem('acess_token')
                            context.commit('destroyToken')
                            resolve(res)
                        }).catch(err => {
                            localStorage.removeItem('acess_token')
                            context.commit('destroyToken')
                            reject(err)
                        })
                })
            }
        },
        register(context, data) {
            return new Promise((resolve, reject) => {
                axios.post('/register', {
                    name: data.name,
                    email: data.email,
                    password: data.password
                }).then(res => {
                    resolve(res)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
        }
    }
})