<template>
  <div class="create-vault">
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
          <VeeValidateField name="description" as="textarea" />
          <p class="form-error">{{ errors.description }}</p>
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
//import Encryption from "../../encryption-flow/Encryption";

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
      description: yup.string()
          .required()
          .label("Description"),
    });

    return {
      schema
    };
  },
}
</script>

<style scoped>

</style>
