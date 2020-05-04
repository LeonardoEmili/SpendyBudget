import Vue from 'vue'
import i18n from './plugins/i18n-vue'
import './plugins/bootstrap-vue'
import './plugins/firebase'
import App from './App.vue'
import router from './router'

// TODO: check if these two dependencies are required (at the moment the web app is working without them)
// remove them from dependencies too (package.json) if they are not needed.
//import '@babel/polyfill'
//import 'mutationobserver-shim'

// Remove production mode's warnings
Vue.config.productionTip = false

export const app = new Vue({
  router,
  i18n,
  render: h => h(App)
});

app.$mount('#app')



