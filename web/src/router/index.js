import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import Registration from "../views/Registration";
import Login from "../views/Login";
import Logout from "../views/Logout";
import Vaults from "../views/Vaults/Vaults";
import CreateVault from "../views/Vaults/CreateVault";
import EditVault from "../views/Vaults/EditVault";
import Profile from "../views/Profile";
import VaultDashboard from "../views/Vaults/VaultDashboard";
import Item from "../views/Vaults/Item/Item";
import CreateLogin from "../views/Vaults/Item/CreateLogin";

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
      },
      {
        path: ":id/create",
        name: "createLogin",
        component: CreateLogin
      }
    ]
  },
  {
    path: "/vaults/:id/items",
    name: "vaultDashboard",
    component: VaultDashboard,
    children: [
      {
        path: ":loginId",
        name: "item",
        component: Item,
        props: true
      }
    ]
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
