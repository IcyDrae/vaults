<template>
  <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div">
    <form @submit="handleSubmit($event, actionHandler)">
      <h1>Create a login!</h1>
      <label>
        <span>Login Name</span>
        <VeeValidateField name="login_name" type="text" :value="login.name.value ?? ''" />
        <p class="form-error">{{ errors.login_name }}</p>
      </label>

      <label>
        <span>Username</span>
        <VeeValidateField name="login_username" type="text" :value="login.login_username.value ?? ''" />
        <p class="form-error">{{ errors.login_username }}</p>
      </label>

      <label>
        <span>E-Mail Address</span>
        <VeeValidateField name="login_email" type="text" :value="login.login_email.value ?? ''" />
        <p class="form-error">{{ errors.login_email }}</p>
      </label>

      <label>
        <span>Website</span>
        <VeeValidateField name="login_website" type="text" :value="login.login_website.value ?? ''" />
        <p class="form-error">{{ errors.login_website }}</p>
      </label>

      <label>
        <span>Password</span>
        <VeeValidateField name="login_password" type="password" :value="login.login_password.value ?? ''" />
        <p class="form-error">{{ errors.login_password }}</p>
      </label>

      <label>
        <span>Description</span>
        <VeeValidateField name="login_description" as="textarea" :value="login.login_description.value ?? ''" />
        <p class="form-error">{{ errors.login_description }}</p>
      </label>

      <button class="btn">{{ ctaLabel }}</button>
      <button v-if="edit"
              type="button"
              class="btn delete-vault-cta"
              @click="showModal = true">
        Delete login
      </button>

      <li class="backend-errors" v-for="error in backendErrors" :key="error">
        {{ error }}
      </li>

      <p class="backend-success">{{ success }}</p>
    </form>
  </VeeValidateForm>
  <transition name="modal" v-if="edit">
    <DeletePrompt v-if="showModal"
                  @deletionConfirmed="deleteHandler"
                  @deletionCancelled="showModal = false">
    </DeletePrompt>
  </transition>
</template>

<script>

import DeletePrompt from "../../DeletePrompt";
import * as VeeValidate from "vee-validate";
import * as yup from "yup";

export default {
  name: "CreateLogin",
  props: {
    login: Object,
    create: Boolean,
    edit: Boolean,
    actionHandler: Function,
    deleteHandler: Function
  },
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
    DeletePrompt
  },
  data() {
    return {
      ctaLabel: "",
      success: "",
      backendErrors: [],
      showModal: false
    }
  },
  mounted() {
    if (this.$props.create) {
      this.ctaLabel = "Create";
    } else if(this.$props.edit) {
      this.ctaLabel = "Save";
    }
  },
  setup() {
    /**
     * Validation rules using 'yup'.
     */
    const schema = yup.object({
      login_name: yup.string()
          .required()
          .label("Name"),
      login_username: yup.string()
          .required()
          .label("Username"),
      login_email: yup.string()
          .email()
          .label("E-Mail"),
      login_website: yup.string()
          .required()
          .label("Website"),
      login_password: yup.string()
          .required()
          .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{16,}$/,
              "The password must Contain at least 16 characters, one uppercase, one lowercase, one number and one special case character."
          )
          .label("Password"),
      login_description: yup.string()
          .label("Description"),
    });

    return {
      schema
    };
  }
}

</script>
