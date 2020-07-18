import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC7dgU615OK5fwLaCxrFeOC6YTaTjvoUUg",
    authDomain: "todos-72ad6.firebaseapp.com",
    databaseURL: "https://todos-72ad6.firebaseio.com",
    projectId: "todos-72ad6",
    storageBucket: "todos-72ad6.appspot.com",
    messagingSenderId: "699074742276",
    appId: "1:699074742276:web:c0372e23dd973d830ccd51",
    measurementId: "G-89MPY1VSRM"
}
const firebaseApp = firebase.initializeApp(firebaseConfig)
const firestore = firebaseApp.firestore()

export default firestore