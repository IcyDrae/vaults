<template>
  <button class="btn" v-on:click="logout">Logout</button>
</template>

<script>

import http from "../services/http";
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers("user");

export default {
  name: "Logout",
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      "getUser"
    ])
  },
  methods: {
    ...mapActions([
      "setUser"
    ]),
    logout() {
      http.request({
        method: "get",
        url: "/logout"
      }, (response) => {
        this.successHandler(response);
      }, (error) => {
        this.errorHandler(error);
      });
    },
    successHandler(response) {
      if (response.status === 204) {
        if (!this.isObjectEmpty(this.getUser)) {
          this.setUser({})
        }
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

<style scoped>

</style>
