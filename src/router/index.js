import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/Signup.vue'
import Hello from '../views/HelloI18n.vue'
import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'
import MoreInfo from '../views/MoreInfo.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Sign up',
    component: SignUp
  },
  {
    path: '/more',
    name: 'MoreInfo',
    component: MoreInfo
  },
  {
    path: '/about',
    name: 'About Us',
    component: Hello
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


export default router