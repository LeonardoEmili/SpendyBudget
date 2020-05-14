import Vue from 'vue'

import { BootstrapVue, BIconUpload, BIconXCircleFill, BIconPlus, BIconGearFill, BIconTrashFill } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.component('upload-icon', BIconUpload);
Vue.component('xcircle-fill', BIconXCircleFill);
Vue.component('plus-icon', BIconPlus);
Vue.component('settings-icon', BIconGearFill);
Vue.component('trash-icon', BIconTrashFill);