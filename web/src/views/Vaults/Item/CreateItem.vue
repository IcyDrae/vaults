<template>
  <div>
    <CreateLogin v-if="type === 'login'" v-bind:vaultId="vaultId"></CreateLogin>
    <CreateNote v-if="type === 'note'" v-bind:vaultId="vaultId"></CreateNote>
  </div>
</template>

<script>

import CreateLogin from "../../../components/Item/CreateLogin";
import CreateNote from "../../../components/Item/CreateNote";

export default {
  name: "CreateItem",
  props: ["type", "vaultId"],
  components: {
    CreateLogin,
    CreateNote
  },
}
</script>

<style scoped>

</style>
