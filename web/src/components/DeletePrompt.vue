<template>
  <div class="overlay delete-vault-overlay">
    <div class="prompt">
      <div class="prompt-message">
        {{ promptText }}
      </div>

      <div>
        <button class="btn delete-vault-cta" type="button" @click="$emit('deletionConfirmed')">Delete</button>
        <button class="btn" type="button" @click="$emit('deletionCancelled')">No, take me back</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "DeletePrompt",
  props: {
    promptText: String
  }
}

</script>

<style scoped>

</style>
