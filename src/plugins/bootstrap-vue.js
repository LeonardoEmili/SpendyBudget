import Vue from 'vue'

import { BootstrapVue, BIconUpload, BIconXCircleFill } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.component('upload-icon', BIconUpload);
Vue.component('xcircle-fill', BIconXCircleFill);