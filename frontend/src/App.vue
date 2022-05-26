<template>
  <div class="head">
    <img src="@/assets/logo.png" alt="Logo" @click="$router.push({ name: 'Home'})">
    <HeadLinks></HeadLinks>
  </div>
  <router-view/>
</template>

<script>

import HeadLinks from "./components/HeadLinks";

export default {
  name: 'App',
  components: {
    HeadLinks
  },
  data() {
    return {
    }
  },
  mounted() {
  },
}

</script>

<style lang="scss">
@import "./styles/index.scss";

</style>
