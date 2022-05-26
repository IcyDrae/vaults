<template>
  <div class="item-detail edit-login">
    <LoginForm
        action="edit"
        :action-handler="handleForm"
        :delete-handler="deleteLogin"
    ></LoginForm>
  </div>
</template>

<script>

import LoginForm from "./LoginForm";
import {api} from "../../../services/api";
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers("app_state");

export default {
  name: "EditLogin",
  components: {
    LoginForm,
  },
  data() {
    return {
      success: "",
      backendErrors: [],
      showModal: false
    }
  },
  methods: {
    ...mapActions([
        "setItemView"
    ]),
    /**
     *
     * @param values
     * @param resetForm
     */
    async handleForm(values, { resetForm }) {
      let response = await api.login.update(values, this.$route.params.itemId);

      if (response instanceof Error) {
        this.backendErrors.push(response);
      } else {
        let updatedLogin = response;
        resetForm();

        await this.$router.push({ name: "item", params: { itemId: updatedLogin.id } });
      }
    },
    async deleteLogin() {
      let response = await api.login.delete(this.$route.params.itemId);

      if (response instanceof Error) {
        this.backendErrors.push(response);
      } else {
        this.showModal = false;
        this.setItemView(false);

        await this.$router.push({ name: "vaultDashboard", params: { id: this.$route.params.id } });
      }
    }
  }
}
</script>

<style scoped>

</style>
