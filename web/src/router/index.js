import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home/Home.vue";
import Attributions from "../views/Home/Attributions.vue";
import Registration from "../views/Registration";
import Login from "../views/Login";
import Vaults from "../views/Vaults/Vaults";
import CreateVault from "../views/Vaults/CreateVault";
import EditVault from "../views/Vaults/EditVault";
import Profile from "../views/Profile";
import VaultDashboard from "../views/Vaults/VaultDashboard";
import Item from "../views/Vaults/Item/Item";
import CreateItem from "../views/Vaults/Item/CreateItem";
import EditItem from "../views/Vaults/Item/EditItem";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/attributions",
        name: "Attributions",
        component: Attributions
      },
    ]
  },
  {
    path: "/register",
    name: "Registration",
    component: Registration
  },
  {
    path: "/login",
    name: "login",
    component: Login
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
    path: "/vaults/:id/items",
    name: "vaultDashboard",
    component: VaultDashboard,
    props: true,
    children: [
      {
        path: ":itemId",
        name: "item",
        component: Item,
        props: true
      },
      {
        path: ":itemId/edit",
        name: "editItem",
        component: EditItem,
        props: true
      },
      {
        path: "create",
        name: "createItem",
        component: CreateItem,
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
