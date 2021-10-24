<template>
  <div class="overlay create-category-overlay">
    <button class="exit-overlay" @click="$emit('closeOverlay')">
      &#10006;
    </button>
    <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div" class="form">
      <form @submit="handleSubmit($event, handleForm)">
        <h2>Create a Folder to organize your items!</h2>
        <label>
          <span>Folder Name</span>
          <VeeValidateField name="category_name" type="text" />
          <p class="form-error">{{ errors.category_name }}</p>
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
  name: "CreateCategory",
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
      category_name: yup.string()
          .required()
          .label("Folder Name")
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
      let encryptedValues = api.category.encryptCategory(values);

      await this.submitForm(encryptedValues, resetForm);
    },
    async submitForm(values, resetForm) {
      let vaultId = this.$route.params.id;
      let response = await api.category.create(values, vaultId);

      if (response instanceof Error) {
        this.errorHandler(response);
      } else {
        resetForm();

        this.$emit("closeOverlay");
      }
    },
    errorHandler(error) {
      console.log(error)
      if (error.response.data.registration === false) {
        this.backendErrors.push(error.response.data.errors)
      }
    }
  }
}
</script>
