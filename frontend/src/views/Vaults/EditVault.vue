<template>
  <div class="overlay edit-vault">
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
                    :prompt-text="deletePromptText"
                    @deletionConfirmed="triggerVaultDelete"
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
      showModal: false,
      deletePromptText: "You are about to delete this vault & all items inside it. This cannot be undone. Are you absolutely sure?"
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

      await this.triggerVaultUpdate(encryptedValues, resetForm);
    },
    async triggerVaultUpdate(values, resetForm) {
      let vaultId = this.$route.params.id;
      let response = await api.vault.update(vaultId, values);

      if (response instanceof Error) {
        this.backendErrors.push(response.response.data.errors);
      } else {
        resetForm();

        this.$router.go(-1);
      }
    },
    async triggerVaultDelete() {
      let vaultId = this.$route.params.id;
      let response = await api.vault.delete(vaultId);

      if (response instanceof Error) {
        this.backendErrors.push(response.response.data.errors)
      } else if (response.status === 204) {
        this.showModal = false;

        this.$router.go(-1);
      }
    }
  }
}
</script>

<style scoped>

</style>
