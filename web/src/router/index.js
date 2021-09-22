import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import Registration from "../views/Registration";
import Login from "../views/Login";
import Logout from "../views/Logout";
import Profile from "../views/Profile";
import Dashboard from "../views/Dashboard";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/registration",
    name: "Registration",
    component: Registration
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
