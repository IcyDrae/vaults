<template>
  <div class="delete-vault-overlay vault-overlay">
    <div class="prompt">
      <div class="prompt-message">
        You are about to delete this vault & all items inside it. This cannot be undone. Are you absolutely sure?
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
  name: "DeletePrompt"
}

</script>

<style scoped>

</style>
