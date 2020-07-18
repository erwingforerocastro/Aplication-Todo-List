import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import db from '../firebase'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

export const store = new Vuex.Store({
    state: {
        loading: true,
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

    },
    actions: {
        addTodo(context, todo) {
            db.collection('todos').add({
                title: todo.title,
                completed: false,
                timestamp: new Date(),
            }).then(docRef => {
                console.log(docRef)
                context.commit('addTodo', {
                    id: docRef.id,
                    title: todo.title,
                    completed: false,
                })
            })


        },
        clearCompleted(context) {

            db.collection('todos').where('completed', '==', true).get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        doc.ref.delete()
                            .then(() => {
                                context.commit('clearCompleted')
                            })
                    })
                })
        },
        changeFilter(context, filter) {
            context.commit('changeFilter', filter)

        },
        checkAllTodos(context, checked) {
            db.collection('todos').get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        doc.ref.update({
                            completed: checked
                        }).then(() => {
                            context.commit('checkAllTodos', checked)
                        })
                    })
                })

        },
        removeItem(context, id) {
            db.collection('todos').doc(id).delete()
                .then(() => {
                    context.commit('removeItem', id)
                })

        },
        saveTodo(context, todo) {
            db.collection('todos').doc(todo.id).set({
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                timestamp: new Date(),
            }).then(() => {
                context.commit('saveTodo', todo)
            })

        },
        retrieveTodos(context) {
            context.state.loading = true
            db.collection('todos').get()
                .then(querySnapshot => {
                    let todos = []
                    querySnapshot.forEach(i => {
                        const data = {
                            id: i.id,
                            title: i.data().title,
                            completed: i.data().completed,
                            timestamp: i.data().timestamp
                        }
                        todos.push(data)
                    })
                    context.state.loading = false
                    todos = todos.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)
                    context.commit('retrieveTodos', todos)
                })

        },
        initRealtimeListeners(context) {
            db.collection("todos").onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        const source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
                        if (source == 'Server') {
                            context.commit('addTodo', {
                                id: change.doc.id,
                                title: change.doc.data().title,
                                completed: false,
                            })
                        }

                    }
                    if (change.type === "modified") {
                        context.commit('saveTodo', {
                            id: change.doc.id,
                            title: change.doc.data().title,
                            completed: change.doc.data().completed,
                        })
                    }
                    if (change.type === "removed") {
                        context.commit('removeItem', change.doc.id)
                    }
                })
            })
        }
    }
})