import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

// TODO: check if these two dependencies are required (at the moment the web app is working without them)
// remove them from dependencies too (package.json) if they are not needed.
//import '@babel/polyfill'
//import 'mutationobserver-shim'

// Remove production mode's warnings
Vue.config.productionTip = false

// Web app's Firebase configuration
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
  router,
  render: h => h(App),
}).$mount('#app')
