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
import Encryption from "../../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';
import http from "../../../services/http";

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
      encryption: new Encryption(),
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
        "updateItem"
    ]),
    deleteHandler() {
      console.log("deleting from parent");
    },
    /**
     *
     * @param values
     * @param resetForm
     */
    handleForm(values, { resetForm }) {
      values.item_type = "login";
      values = JSON.stringify(values);
      let encryptedValues = this.encryption.encrypt(values, this.getEncryptionKey);

      this.submitForm(encryptedValues, resetForm);
    },
    submitForm(values, resetForm) {
      let url = `/logins/update/${this.loginData.id}`;

      http.request({
        method: "put",
        url: url,
        data: {
          userId: this.getUser.id,
          data: values
        }
      }).then(response => {
        this.successHandler(response, resetForm);
      }).catch(error => {
        console.log(error)
        //this.backendErrors.push(error.response.data.errors);
      });
    },
    successHandler(response, resetForm) {
      if(response.status === 200) {
        let updatedLogin = this.decryptLogin(response.data);
        this.updateItem(updatedLogin);

        resetForm();

        this.$router.push({ name: "item", params: { itemId: updatedLogin.id, itemData: JSON.stringify(updatedLogin) } });
      }
    },
    /**
     * Decrypts the given logins & decodes them into an array.
     *
     * @param response
     * @returns {{}}
     */
    decryptLogin(response) {
      let decryptedLogins = {};

      let login = response.data;

      login = this.encryption.decrypt(login, this.getEncryptionKey);
      login = JSON.parse(login);

      response.data = login;

      decryptedLogins = this.restructureLoginObject(response);

      return decryptedLogins;
    },
    /**
     * Makes a new login array with the decrypted data.
     *
     * @param object
     */
    restructureLoginObject(object) {
      return {
        "id": object.id,
        "name": {
          "label": "Name",
          "value": object.data.login_name,
          "type": "text"
        },
        "login_username": {
          "label": "Username",
          "value": object.data.login_username,
          "type": "text"
        },
        "login_email": {
          "label": "E-Mail",
          "value": object.data.login_email ?? "",
          "type": "text"
        },
        "login_website": {
          "label": "Website",
          "value": object.data.login_website,
          "type": "text"
        },
        "login_password": {
          "label": "Password",
          "value": object.data.login_password,
          "type": "password"
        },
        "login_description": {
          "label": "Description",
          "value": object.data.login_description ?? "",
          "type": "textarea"
        },
        "item_type": object.data.item_type
      };
    },
    deleteVault() {
      let url = `/vaults/delete/${this.$route.params.id}`;

      http.request({
        method: "delete",
        url: url,
        data: JSON.stringify({
          userId: this.getUser.id
        })
      }).then(response => {
        if(response.status === 204) {
          this.showModal = false;

          this.$router.go(-1);
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
