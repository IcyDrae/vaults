<template>
  <button class="btn" v-on:click="fetchProfile">Fetch profile</button>
</template>

<script>

import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
    }
  },
  methods: {
    fetchProfile() {
      axios.get(process.env.VUE_APP_API_HOSTNAME + "/user/profile", {
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
