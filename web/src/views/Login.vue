<template>
  <VeeValidateForm :validation-schema="schema"
                   v-slot="{ errors, handleSubmit }"
                   as="div"
                   class="login-form form">
    <form @submit="handleSubmit($event, handleForm)">
      <h1>Login</h1>
      <label>
        <span>E-Mail</span>
        <VeeValidateField name="login_email" type="email" />
        <p class="form-error">{{ errors.login_email }}</p>
      </label>

      <label>
        <span>Master Password</span>
        <VeeValidateField name="login_master_password" type="password" />
        <p class="form-error">{{ errors.login_password }}</p>
      </label>

      <button>Login</button>

      <li class="backend-errors" v-for="error in backendErrors" :key="error">
        {{ error }}
      </li>

      <p class="backend-success">{{ success }}</p>
    </form>
  </VeeValidateForm>
</template>

<script>

import * as VeeValidate from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';
import { createNamespacedHelpers } from 'vuex';
import Encryption from "../encryption-flow/Encryption";

const { mapActions, mapGetters } = createNamespacedHelpers("user");

export default {
  name: "Login",
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
      login_email: yup.string()
          .required()
          .email()
          .label("E-Mail"),
      login_master_password: yup.string()
          .required()
          .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{16,}$/,
              "The password must Contain at least 16 characters, one uppercase, one lowercase, one number and one special case character."
          )
          .label("Master Password"),
    });

    return {
      schema
    };
  },
  methods: {
    ...mapActions([
        "setUser",
        "setEncryptionKey",
    ]),
    /**
     * The main submit handler.
     *
     * @param values
     * @param resetForm
     */
    async handleForm(values, { resetForm }) {
      let hashes = await this.deriveFromMasterPassword(values)

      this.setEncryptionKey(hashes.encryptionKey);

      values.login_master_password = hashes.authenticationHash.toString("hex");

      this.submitForm(values, resetForm);
    },
    /**
     * Hash the master password into an encryption key and an authentication hash.
     *
     * @param values
     * @returns Object
     */
    async deriveFromMasterPassword(values) {
      let encryptionKey = await this.encryption.hash(values.login_master_password, values.login_email, 100100);
      let authenticationHash = await this.encryption.hash(values.login_master_password, encryptionKey, 1);

      return {
        encryptionKey,
        authenticationHash
      };
    },
    submitForm(values, resetForm) {
      axios
          .post(process.env.VUE_APP_API_HOSTNAME + "/login", {
                form: values,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true
              })
          .then(response => {
            if(response.data.authenticated === true) {
              this.success = "You are now logged in!";

              this.persistUser(response.data.user);

              resetForm();

              this.$router.push("/vaults");
            }
          })
          .catch(error => {
            if (error.response.data.login === false) {
              this.backendErrors.push(error.response.data.errors)
            }
          })
    },
    /**
     * Set the global user object.
     *
     * @param data
     */
    persistUser(data) {
      let user = JSON.parse(data);

      if (this.isObjectEmpty(this.getUser)) {
        this.setUser({
          "id": user.id,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "email": user.email,
          "username": user.username,
          "roles": user.roles,
          "registeredAt": user.registeredAt
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
