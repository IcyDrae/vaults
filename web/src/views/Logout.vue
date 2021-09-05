<template>
  <button v-on:click="logout">Logout</button>
</template>

<script>

import axios from "axios";
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
      axios.get(process.env.VUE_APP_API_HOSTNAME + "/logout", {
        headers: {
          'Content-Type': 'application/json',
        },
        data: null,
        withCredentials: true
      })
      .then(response => {
        if (response.status === 204) {
          // Delete the global user object from the state management storage.
          if (!this.isObjectEmpty(this.getUser)) {
            this.setUser({})
          }
        }
      })
      .catch(error => {
        console.log(
            error.message
        )
      })
    }
  }
}
</script>

<style scoped>

</style>
