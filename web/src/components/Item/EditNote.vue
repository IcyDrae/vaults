<template>
  <div class="item-detail edit-login">
    <!--  :initial-values="{ vault_name: vault_name, vault_description: vault_description }"  -->
    <VeeValidateForm :validation-schema="schema"
                     v-slot="{ errors, handleSubmit }" as="div">
      <form @submit="handleSubmit($event, handleForm)">
        <h1>Edit item!</h1>
        <div v-for="(property, index) in item" :key="property.id">
          <label>
            <span>{{ property.label }}</span>
            <VeeValidateField :name="index" type="text" />
            <p class="form-error">{{ errors.vault_name }}</p>
          </label>
        </div>

        <button class="btn">Save changes</button>
        <button type="button" class="btn delete-vault-cta" @click="showModal = true">Delete vault</button>

        <li class="backend-errors" v-for="error in backendErrors" :key="error">
          {{ error }}
        </li>

        <p class="backend-success">{{ success }}</p>
      </form>
    </VeeValidateForm>
    <transition name="modal">
      <DeletePrompt v-if="showModal"
                    @deletionConfirmed="deleteVault"
                    @deletionCancelled="showModal = false">
      </DeletePrompt>
    </transition>
  </div>
</template>

<script>

import {api} from "../../services/api";
import DeletePrompt from "../../components/DeletePrompt";
import * as VeeValidate from "vee-validate";
import * as yup from "yup";
import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';
import http from "../../services/http";

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: "EditLogin",
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
    DeletePrompt
  },
  props: ["itemId", "itemData"],
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
    item() {
      let data = JSON.parse(this.$props.itemData);

      let dataArray = Object.entries(data);

      let filtered = dataArray.filter((key) => {
        return key[0] !== "id" && key[0] !== "item_type";
      });

      return Object.fromEntries(filtered);
    }
  },
  setup() {
    /**
     * Validation rules using 'yup'.
     */
    const schema = yup.object({
      vault_name: yup.string()
          .required()
          .label("Vault Name"),
      vault_description: yup.string()
          .required()
          .label("Vault Description"),
    });

    return {
      schema
    };
  },
  methods: {
    /**
     *
     * @param values
     * @param resetForm
     */
    handleForm(values, { resetForm }) {
      values = JSON.stringify(values);
      let encryptedValues = this.encryption.encrypt(values, this.getEncryptionKey);

      this.submitForm(encryptedValues, resetForm);
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
