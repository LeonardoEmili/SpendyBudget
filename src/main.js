// Import Vue and initialize Boostrap
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Remove the production mode warning
Vue.config.productionTip = false
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

import firebase from 'firebase'

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

import App from './App.vue'
import router from './router'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
