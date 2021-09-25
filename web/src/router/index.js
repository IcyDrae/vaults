import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import Registration from "../views/Registration";
import Login from "../views/Login";
import Logout from "../views/Logout";
import Vaults from "../views/Vaults/Vaults";
import CreateVault from "../views/Vaults/CreateVault";
import EditVault from "../views/Vaults/EditVault";
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
    path: "/vaults",
    name: "vaults",
    component: Vaults,
    children: [
      {
        path: "create",
        name: "createVault",
        component: CreateVault
      },
      {
        path: ":id/edit",
        name: "editVault",
        component: EditVault,
        props: true
      }
    ]
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
