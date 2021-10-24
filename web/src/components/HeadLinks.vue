<!--
This component contains the head links which include registration, login, logout & profile.
These links are rendered based on the user state.
-->
<template>
  <div :class="containerClass" v-if="!this.isObjectEmpty(this.getUser)">
    <router-link to="/vaults">Vaults</router-link>
    <router-link to="/logout">Logout</router-link>
  </div>
  <div :class="containerClass" v-if="this.isObjectEmpty(this.getUser)">
    <router-link to="/login">Login</router-link>
    <router-link to="/registration">Registration</router-link>
  </div>
</template>

<script>
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
      "setUser"
    ])
  }
}
</script>
