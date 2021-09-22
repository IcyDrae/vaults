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
    <div class="create-vault-cta">
      <router-link to="/vaults/create">
        <img src="@/assets/add.png" alt="An add icon.">
      </router-link>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>

export default {
  name: "Vaults",
}
</script>

<style scoped>

</style>
