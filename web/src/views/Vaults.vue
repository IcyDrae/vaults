<template>
  <div class="vaults">
    <div class="vault">
      <p>My personal vault</p>
      <p>37 Items</p>
      <p class="vault-description">This is my personal vault, where I store my personal things!</p>
    </div>
    <div class="vault">
      <p>My work vault</p>
      <p>14 Items</p>
    </div>
    <div class="create-vault">
      <img v-on:click="createVault" src="@/assets/add.png" alt="An add icon.">
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "Vaults",
  methods: {
    createVault() {
      axios.put
    }
  }
}
</script>

<style scoped>

</style>
