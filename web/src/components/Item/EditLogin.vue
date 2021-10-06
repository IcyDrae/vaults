<template>
  <div class="item-detail edit-login">
    <Form
        :editing="true"
        :action-handler="handleForm"
        :delete-handler="deleteHandler"
        :login="loginData"
    ></Form>
  </div>
</template>

<script>

import {api} from "../../services/api";
import Form from "../../components/Item/Login/Form";
import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';
import http from "../../services/http";

const { mapGetters } = createNamespacedHelpers("user");

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
  mounted() {
    //let itemType = JSON.parse(this.$props.itemData).item_type;

    console.log(api["note"].schema)

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
    deleteHandler() {
      console.log("deleting from parent");
    },
    /**
     *
     * @param values
     * @param resetForm
     */
    handleForm(values, { resetForm }) {
      console.log(values, resetForm)
      /*values = JSON.stringify(values);
      let encryptedValues = this.encryption.encrypt(values, this.getEncryptionKey);

      this.submitForm(encryptedValues, resetForm);*/
    },
    submitForm(values, resetForm) {
      let url = `/vaults/update/${this.$route.params.id}`;

      http.request({
        method: "put",
        url: url,
        data: {
          userId: this.getUser.id,
          data: values
        }
      }).then(response => {
        if(response.status === 204) {
          resetForm();

          this.$router.go(-1);
        }
      }).catch(error => {
        this.backendErrors.push(error.response.data.errors);
      });
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
