<!--
This component contains the head links which include registration, login, logout & profile.
These links are rendered based on the user state.
-->
<template>
  <div :class="containerClass" v-if="!this.isObjectEmpty(this.getUser)">
    <router-link to="/vaults">Vaults</router-link>
    <a href="#" @click="logout">Logout</a>
  </div>
  <div :class="containerClass" v-if="this.isObjectEmpty(this.getUser)">
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Registration</router-link>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex';
import {api} from "../services/api";

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: 'HeadLinks',
  data() {
    return {
      containerClass: "head-links",
    };
  },
  computed: {
    ...mapGetters([
      "getUser"
    ])
  },
  methods: {
    async logout() {
      let response = await api.authentication.logout();

      if (response instanceof Error) {
        console.log(response.message)
      }
    }
  }
}
</script>
