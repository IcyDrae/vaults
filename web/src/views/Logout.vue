<template>
  <button v-on:click="logout">Logout</button>
</template>

<script>

import axios from "axios";

export default {
  name: "Logout",
  data() {
    return {
    }
  },
  methods: {
    logout() {
      axios.get(process.env.VUE_APP_API_HOSTNAME + "/logout", {
        headers: {
          'Content-Type': 'application/json',
        },
        data: null,
        withCredentials: true
      })
      .then(response => {
        console.log(
            response
        )
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
