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
import {Security} from "../../../plugins/Security";
import { createNamespacedHelpers } from 'vuex';
import http from "../../../services/http";
import {api} from "../../../services/api";

const { mapActions, mapGetters } = createNamespacedHelpers("user");

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
      security: new Security(),
      showModal: false
    }
  },
  computed: {
    ...mapGetters([
      "getUser",
      "getEncryptionKey",
    ]),
    /**
     * Watches for changes for the $props.itemData, excludes specific properties.
     */
    loginData() {
      return JSON.parse(this.$props.login);
    }
  },
  methods: {
    ...mapActions([
        "addItem",
        "updateItem",
        "deleteItem"
    ]),
    deleteHandler() {
      this.deleteVault();
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
    deleteVault() {
      let url = `/logins/delete/${this.loginData.id}`;

      http.request({
        method: "delete",
        url: url,
        data: JSON.stringify({
          userId: this.getUser.id
        })
      }).then(response => {
        if(response.status === 204) {
          this.showModal = false;

          this.deleteItem(this.loginData.id);

          this.$router.push({ name: "vaultDashboard", params: { id: this.$route.params.id } });
        }
      }).catch(error => {
        this.backendErrors.push(error.response.data.errors)
      });
    }
  }
}
</script>

<style scoped>

</style>
