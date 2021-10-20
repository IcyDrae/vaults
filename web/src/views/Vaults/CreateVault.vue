<template>
  <div class="overlay create-vault">
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

        <button class="btn">Create</button>

        <li class="backend-errors" v-for="error in backendErrors" :key="error">
          {{ error }}
        </li>

        <p class="backend-success">{{ success }}</p>
      </form>
    </VeeValidateForm>
  </div>
</template>

<script>

import {api} from "../../services/api";
import * as VeeValidate from "vee-validate";
import * as yup from "yup";

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
    async handleForm(values, { resetForm }) {
      let encryptedValues = api.vault.encryptVault(values);

      await this.submitForm(encryptedValues, resetForm);
    },
    async submitForm(values, resetForm) {
      let response = await api.vault.create(values);

      if (response instanceof Error) {
        this.errorHandler(response);
      } else {
        resetForm();

        this.$router.push("/vaults");
      }
    },
    errorHandler(error) {
      if (error.response.data.registration === false) {
        this.backendErrors.push(error.response.data.errors)
      }
    }
  }
}
</script>

<style scoped>

</style>
