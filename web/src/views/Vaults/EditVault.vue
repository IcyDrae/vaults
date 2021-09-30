<template>
  <div class="edit-vault vault-overlay">
    <button class="exit-overlay" v-on:click="$router.go(-1)">
      &#10006;
    </button>
    <VeeValidateForm :validation-schema="schema"
                     :initial-values="{ vault_name: vault_name, vault_description: vault_description }"
                     v-slot="{ errors, handleSubmit }" as="div" class="form">
      <form @submit="handleSubmit($event, handleForm)">
        <h1>Edit your vault!</h1>
        <label>
          <span>Vault Name</span>
          <VeeValidateField name="vault_name" type="text" />
          <p class="form-error">{{ errors.vault_name }}</p>
        </label>

        <label>
          <span>Description</span>
          <VeeValidateField name="vault_description" as="textarea" />
          <p class="form-error">{{ errors.vault_description }}</p>
        </label>

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

import DeletePrompt from "../../components/DeletePrompt";
import * as VeeValidate from "vee-validate";
import * as yup from "yup";
import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';
import http from "../../services/http";

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: "CreateVault",
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
    DeletePrompt
  },
  props: ["vault_name", "vault_description"],
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
    ])
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
      }, (response) => {
        if(response.status === 204) {
          resetForm();

          this.$router.go(-1);
        }
      }, (error) => {
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
      }, (response) => {
        if(response.status === 204) {
          this.showModal = false;

          this.$router.go(-1);
        }
      }, (error) => {
        this.backendErrors.push(error.response.data.errors)
      });
    }
  }
}
</script>

<style scoped>

</style>
