<template>
  <div>
    <CreateLogin v-if="type === 'login'"></CreateLogin>
    <CreateNote v-if="type === 'note'"></CreateNote>
  </div>
</template>

<script>

import CreateLogin from "../../../components/Item/CreateLogin";
import CreateNote from "../../../components/Item/CreateNote";

export default {
  name: "CreateItem",
  props: ["type"],
  components: {
    CreateLogin,
    CreateNote
  },
}
</script>

<style scoped>

</style>
