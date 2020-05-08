import Vue from 'vue'
import i18n from './plugins/i18n-vue'
import './plugins/bootstrap-vue'
import { user } from './plugins/firebase'
import './plugins/vee-validate'
import './plugins/vue-croppie';
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

// TODO: check if these two dependencies are required (at the moment the web app is working without them)
// remove them from dependencies too (package.json) if they are not needed.
//import '@babel/polyfill'
//import 'mutationobserver-shim'

// Remove production mode's warnings
Vue.config.productionTip = false

export const app = new Vue({
  data: {
    user
  },
  router,
  i18n,
  vuetify,
  render: h => h(App)
});

app.$mount('#app')



