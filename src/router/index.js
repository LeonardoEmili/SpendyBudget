import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/Signup.vue'
import About from '../components/About.vue'
//import Profile from '../views/Profile.vue'

//import Index from './components/Index.vue'

//const routes = {'/': Index,'/login': Login}

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
    path: '/about',
    name: 'About Us',
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router