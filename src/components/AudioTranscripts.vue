<template>
  <div>
    <v-card v-for="(audio, index) in localAudio" :key="index" class="my-4">
      <v-card-title>
        <audio-player :src="audio.audio"></audio-player>
      </v-card-title>
      <v-card-text>
        <div>{{ audio.transcriptions.text }}</div>
      </v-card-text>
      <div class="pa-4" :class="audio.chatGPT >= 50 ? 'bg-green' : 'bg-red'">
        {{ audio.chatGPT }}
      </div>
    </v-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import AudioPlayer from "./AudioPlayer.vue";

export default defineComponent({
  components: { AudioPlayer },
  props: {
    localAudio: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style></style>
