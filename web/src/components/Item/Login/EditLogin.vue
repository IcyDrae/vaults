<template>
  <div class="item-detail edit-login">
    <Form
        :edit="true"
        :action-handler="handleForm"
        :delete-handler="deleteHandler"
        :login="loginData"
    ></Form>
  </div>
</template>

<script>

import Form from "../../../components/Item/Login/Form";
import {api} from "../../../services/api";

export default {
  name: "EditLogin",
  components: {
    Form,
  },
  props: ["login"],
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
    loginData() {
      return JSON.parse(this.$props.login);
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
      let response = await api.login.update(values, this.loginData.id);

      if (response instanceof Error) {
        this.backendErrors.push(response);
      } else {
        let updatedLogin = response;
        resetForm();

        await this.$router.push({ name: "item", params: { itemId: updatedLogin.id, itemData: JSON.stringify(updatedLogin) } });
      }
    },
    async deleteVault() {
      let response = await api.login.delete(this.loginData.id);

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
