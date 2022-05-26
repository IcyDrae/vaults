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
        <span>Note Name</span>
        <VeeValidateField name="note_name" type="text" :value="note ? note.name.value : ''" />
        <p class="form-error">{{ errors.note_name }}</p>
      </label>

      <label>
        <span>Description</span>
        <VeeValidateField name="note_description" as="textarea" :value="note ? note.note_description.value : ''" />
        <p class="form-error">{{ errors.note_description }}</p>
      </label>

      <button class="btn">{{ ctaLabel }}</button>
      <button v-if="action === 'edit'"
              type="button"
              class="btn delete-vault-cta"
              @click="showModal = true">
        Delete note
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

import DeletePrompt from "../../DeletePrompt";
import * as VeeValidate from "vee-validate";
import * as yup from "yup";
import { createNamespacedHelpers } from 'vuex';

const { mapState } = createNamespacedHelpers("user");
const { mapActions: mapActionsApp } = createNamespacedHelpers("app_state");

export default {
  name: "NoteForm",
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
      deletePromptText: "You are about to delete this note. This cannot be undone. Are you sure?"
    }
  },
  computed: {
    ...mapState({
      categories(state) {
        return state.categories.filter(category => category.vault_id == this.$route.params.id);
      },
      note(state) {
        let self = this;

        return state.items.find(item => item.id == self.$route.params.itemId);
      }
    }),
    categoryValue() {
      return this.note ? this.note.category : "";
    }
  },
  beforeMount() {
    this.setItemView(true);
  },
  mounted() {
    if (this.$props.action === "create") {
      this.ctaLabel = "Create";
      this.headline = "Create a note!";
    } else if(this.$props.action === "edit") {
      this.ctaLabel = "Save";
      this.headline = "Edit " + this.note.name.value;
    }
  },
  setup() {
    /**
     * Validation rules using 'yup'.
     */
    const schema = yup.object({
      note_name: yup.string()
          .required()
          .label("Name"),
      note_description: yup.string()
          .label("Description"),
    });

    return {
      schema
    };
  },
  methods: {
    ...mapActionsApp([
      "setItemView"
    ])
  }
}

</script>
