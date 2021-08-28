import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Registration from "../views/Registration";
import Login from "../views/Login";
import Profile from "../views/Profile";
import Logout from "../views/Logout";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
