<template>
  <div class="item-detail edit-login">
    <NoteForm
        action="edit"
        :action-handler="handleForm"
        :delete-handler="deleteHandler"
        :note="noteData"
    ></NoteForm>
  </div>
</template>

<script>

import NoteForm from "./NoteForm";
import {api} from "../../../services/api";

export default {
  name: "EditNote",
  components: {
    NoteForm,
  },
  props: ["note"],
  data() {
    return {
      success: "",
      backendErrors: [],
      showModal: false
    }
  },
  computed: {
    /**
     * Watches for changes for the $props.itemData, excludes specific properties.
     */
    noteData() {
      return JSON.parse(this.$props.note);
    }
  },
  methods: {
    async deleteHandler() {
      await this.deleteVault();
    },
    /**
     *
     * @param values
     * @param resetForm
     */
    async handleForm(values, { resetForm }) {
      let response = await api.note.update(values, this.noteData.id);

      if (response instanceof Error) {
        this.backendErrors.push(response);
      } else {
        let updatedNote = response;
        resetForm();

        await this.$router.push({ name: "item", params: { itemId: updatedNote.id, itemData: JSON.stringify(updatedNote) } });
      }
    },
    async deleteVault() {
      let response = await api.note.delete(this.noteData.id);

      if (response instanceof Error) {
        this.backendErrors.push(response);
      } else {
        this.showModal = false;

        await this.$router.push({ name: "vaultDashboard", params: { id: this.$route.params.id } });
      }
    }
  }
}
</script>

<style scoped>

</style>
