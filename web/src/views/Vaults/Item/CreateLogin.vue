<template>
  <div class="vault-overlay">
    <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div" class="form">
      <form @submit="handleSubmit($event, handleForm)">
        <h1>Create a password!</h1>
        <label>
          <span>Login Name</span>
          <VeeValidateField name="login_name" type="text" />
          <p class="form-error">{{ errors.login_name }}</p>
        </label>

        <label>
          <span>Username</span>
          <VeeValidateField name="login_username" type="text" />
          <p class="form-error">{{ errors.login_username }}</p>
        </label>

        <label>
          <span>E-Mail Address</span>
          <VeeValidateField name="login_email" type="text" />
          <p class="form-error">{{ errors.login_email }}</p>
        </label>

        <label>
          <span>Website</span>
          <VeeValidateField name="website" type="text" />
          <p class="form-error">{{ errors.website }}</p>
        </label>

        <label>
          <span>Password</span>
          <VeeValidateField name="login_password" type="text" />
          <p class="form-error">{{ errors.login_password }}</p>
        </label>

        <label>
          <span>Description</span>
          <VeeValidateField name="login_description" as="textarea" />
          <p class="form-error">{{ errors.login_description }}</p>
        </label>

        <button class="btn">Create</button>

        <li class="backend-errors" v-for="error in backendErrors" :key="error">
          {{ error }}
        </li>

        <p class="backend-success">{{ success }}</p>
      </form>
    </VeeValidateForm>
  </div>
  <router-view></router-view>
</template>

<script>

const ITEM_TYPE = "login";

import http from "../../../services/http";
import Encryption from "../../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';
import * as VeeValidate from "vee-validate";
import * as yup from "yup";

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: "CreateLogin",
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
  mounted() {
  },
  computed: {
    ...mapGetters([
      "getUser",
      "getEncryptionKey"
    ])
  },
  setup() {
    /**
     * Validation rules using 'yup'.
     */
    const schema = yup.object({
      login_name: yup.string()
          .required()
          .label("Login Name"),
      login_description: yup.string()
          .required()
          .label("Login Description"),
    });

    return {
      schema,
      ITEM_TYPE
    };
  },
  methods: {
    /**
     *
     * @param values
     * @param resetForm
     */
    handleForm(values, { resetForm }) {
      values.item_type = ITEM_TYPE;
      values = JSON.stringify(values);
      let encryptedValues = this.encryption.encrypt(values, this.getEncryptionKey);

      this.submitForm(encryptedValues, resetForm);
    },
    submitForm(values, resetForm) {
      http.request({
        method: "post",
        url: "/logins/create",
        data: {
          vaultId: this.$route.params.id,
          userId: this.getUser.id,
          data: values
        }
      }).then(response => {
        this.successHandler(response, resetForm);
      }).catch(error => {
        this.errorHandler(error);
      });
    },
    successHandler(response, resetForm) {
      if(response.status === 201) {
        resetForm();

        this.$router.push("/vaults");
      }
    },
    errorHandler(error) {
      if (error.response.data.registration === false) {
        this.backendErrors.push(error.response.data.errors);
      }
    }
  }
}
</script>

<style scoped>

</style>
