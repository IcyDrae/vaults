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
    <router-link to="/registration">Registration</router-link>
  </div>
</template>

<script>

import http from "../services/http";
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers("user");

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
    ...mapActions([
      "setUser",
      "setEncryptionKey"
    ]),
    logout() {
      http.request({
        method: "get",
        url: "/logout"
      }).then(response => {
        this.successHandler(response);
      }).catch(error => {
        this.errorHandler(error);
      });
    },
    successHandler(response) {
      if (response.status === 204) {
        this.setEncryptionKey({});

        if (!this.isObjectEmpty(this.getUser)) {
          this.setUser({})
        }

        this.$router.push("/login");
      }
    },
    errorHandler(error) {
      console.log(
          error.message
      )
    }
  }
}
</script>
