import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/Signup.vue'
//import About from '../components/About.vue'
import Hello from '../components/HelloI18n.vue'
import Home from '../components/Home.vue'
//import Profile from '../views/Profile.vue'

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
    component: Hello
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


export default router