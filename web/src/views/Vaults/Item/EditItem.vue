<template>
  <div>
    <EditLogin v-if="itemType === 'login'" v-bind:login="item"></EditLogin>
    <EditNote v-if="itemType === 'note'" v-bind:note="item"></EditNote>
  </div>
</template>

<script>

import EditLogin from "../../../components/Item/Login/EditLogin";
import EditNote from "../../../components/Item/Note/EditNote";

export default {
  name: "EditItem",
  components: {
    EditLogin,
    EditNote
  },
  props: ["item"],
  computed: {
    itemType() {
      let parsedItem = JSON.parse(this.$props.item);
      return parsedItem.item_type;
    }
  }
}
</script>
