import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'


Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWFn7YZi8syAr1PMbW90A97hCoxXz-oe0",
  authDomain: "spendybudget.firebaseapp.com",
  databaseURL: "https://spendybudget.firebaseio.com",
  projectId: "spendybudget",
  storageBucket: "spendybudget.appspot.com",
  messagingSenderId: "1054189573271",
  appId: "1:1054189573271:web:b61efa9175b36545a6c5d2",
  measurementId: "G-G5Z5EKNL29"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()


new Vue({
  render: h => h(App),
}).$mount('#app')
