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
import { useLocalStorage } from "@vueuse/core";
import AudioPlayer from "./AudioPlayer.vue";
export default defineComponent({
  components: { AudioPlayer },
  data() {
    return {
      localAudio: useLocalStorage("localAudio", []),
    };
  },
});
</script>

<style></style>
