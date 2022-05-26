<template>
  <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div">
    <form @submit="handleSubmit($event, actionHandler)">
      <p class="back" @click="$router.push({ name: 'vaultDashboard', params: { id: this.$route.params.id } }); this.setItemView(false)">Back</p>
      <h1>{{ headline }}</h1>

      <label>
        <VeeValidateField class="categories-select" v-model="categoryValue" name="category" as="select">
          <option value="" disabled>Set to folder</option>
          <option value="0">none</option>
          <option v-for="category in categories"
                  :key="category.id"
                  :value="category.id">
            {{ category.category_name }}
          </option>
        </VeeValidateField>
      </label>

      <label>
        <span>Login Name</span>
        <VeeValidateField name="login_name" type="text" :value="login ? login.name.value : ''" />
        <p class="form-error">{{ errors.login_name }}</p>
      </label>

      <label>
        <span>Username</span>
        <VeeValidateField name="login_username" type="text" :value="login ? login.login_username.value : ''" />
        <p class="form-error">{{ errors.login_username }}</p>
      </label>

      <label>
        <span>E-Mail Address</span>
        <VeeValidateField name="login_email" type="text" :value="login ? login.login_email.value : ''" />
        <p class="form-error">{{ errors.login_email }}</p>
      </label>

      <label>
        <span>Website</span>
        <VeeValidateField name="login_website" type="text" :value="login ? login.login_website.value : ''" />
        <p class="form-error">{{ errors.login_website }}</p>
      </label>

      <label>
        <VeeValidateField v-model="this.getGeneratedPassword" name="login_password" v-slot="{ field }">
          <span>Password</span>
          <input ref="password" v-bind="field" type="text">
          <p class="form-error">{{ errors.login_password }}</p>
        </VeeValidateField>
      </label>
      <div class="input-cta-container input-cta-container-form">
        <span class="input-cta generate" @click="createPassword">Generate</span>
        <span class="input-cta copy" @click="this.copyToClipboard('password')">Copy</span>
      </div>

      <label>
        <span>Description</span>
        <VeeValidateField name="login_description" as="textarea" :value="login ? login.login_description.value : ''" />
        <p class="form-error">{{ errors.login_description }}</p>
      </label>

      <button class="btn">{{ ctaLabel }}</button>
      <button v-if="action === 'edit'"
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
  <transition name="modal" v-if="action === 'edit'">
    <DeletePrompt v-if="showModal"
                  :prompt-text="deletePromptText"
                  @deletionConfirmed="deleteHandler"
                  @deletionCancelled="showModal = false">
    </DeletePrompt>
  </transition>
</template>

<script>

import password_generator from "../../../services/password_generator";
import DeletePrompt from "../../DeletePrompt";
import * as VeeValidate from "vee-validate";
import * as yup from "yup";
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions, mapGetters } = createNamespacedHelpers("user");
const { mapActions: mapActionsApp } = createNamespacedHelpers("app_state");

export default {
  name: "LoginForm",
  props: {
    action: {
      type: String,
      required: true,
    },
    actionHandler: {
      type: Function,
      required: true
    },
    deleteHandler: {
      type: Function,
      default: undefined
    }
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
      headline: "",
      success: "",
      backendErrors: [],
      showModal: false,
      deletePromptText: "You are about to delete this login. This cannot be undone. Are you sure?"
    }
  },
  computed: {
    ...mapGetters([
      "getGeneratedPassword"
    ]),
    ...mapState({
      categories(state) {
        return state.categories.filter(category => category.vault_id == this.$route.params.id);
      },
      login: function(state) {
        let self = this;

        return state.items.find(item => item.id == self.$route.params.itemId);
      }
    }),
    categoryValue() {
      return this.login ? this.login.category : "";
    }
  },
  beforeMount() {
    this.setItemView(true);
  },
  mounted() {
    this.login ? this.setGeneratedPassword(this.login.login_password.value) : this.setGeneratedPassword("");

    if (this.$props.action === "create") {
      this.ctaLabel = "Create";
      this.headline = "Create a login!";
    } else if(this.$props.action === "edit") {
      this.ctaLabel = "Save";
      this.headline = "Edit " + this.login.name.value;
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
      login_description: yup.string()
          .label("Description"),
    });

    return {
      schema
    };
  },
  methods: {
    ...mapActions([
        "setGeneratedPassword"
    ]),
    ...mapActionsApp([
        "setItemView"
    ]),
    createPassword() {
      let passwordElement = this.$refs.password;

      if (passwordElement.getAttribute("type") === "password") {
        passwordElement.setAttribute("type", "text");
      }

      this.setGeneratedPassword(password_generator.generate());
    }
  }
}

</script>
