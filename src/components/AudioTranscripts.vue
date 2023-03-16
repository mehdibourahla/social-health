<template>
  <div>
    <v-card v-for="audio in localAudio" :key="audio.id" class="my-4">
      <v-card-title :class="audio.chatGPT >= 50 ? 'bg-green' : 'bg-red'">
        <div class="d-flex align-center justify-space-between">
          <span> Score: {{ audio.chatGPT }}</span>
          <v-btn
            @click="() => $emit('delete-transcript', audio.id)"
            variant="text"
          >
            <v-icon end size="32">mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text class="pt-2">
        <div>{{ audio.transcriptions.text }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    localAudio: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style></style>
