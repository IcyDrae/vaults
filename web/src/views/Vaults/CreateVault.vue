<template>
  <div class="create-vault vault-overlay">
    <button class="exit-overlay" v-on:click="$router.go(-1)">
      &#10006;
    </button>
    <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div" class="form">
      <form @submit="handleSubmit($event, handleForm)">
        <h1>Create a custom vault!</h1>
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

        <button>Create</button>

        <li class="backend-errors" v-for="error in backendErrors" :key="error">
          {{ error }}
        </li>

        <p class="backend-success">{{ success }}</p>
      </form>
    </VeeValidateForm>
  </div>
</template>

<script>

import * as VeeValidate from "vee-validate";
import * as yup from "yup";
import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';
import axios from "axios";

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: "CreateVault",
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
  },
  data() {
    return {
      success: "",
      backendErrors: [],
      encryption: new Encryption()
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
      axios
          .post(process.env.VUE_APP_API_HOSTNAME + "/vaults/create", {
            userId: this.getUser.id,
            data: values
          },
              {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true
          })
          .then(response => {
            if(response.status === 201) {
              resetForm();

              this.$router.push("/vaults");
            }
          })
          .catch(error => {
            if (error.response.data.registration === false) {
              this.backendErrors.push(error.response.data.errors)
            }
          })
    }
  }
}
</script>

<style scoped>

</style>
