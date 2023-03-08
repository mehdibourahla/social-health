<template>
  <div>
    <div v-for="(audio, index) in localAudio" :key="index">
      <audio :src="audio.audio" controls></audio>
      <div>{{ audio.transcriptions.text }}</div>
      <div>{{ audio.chatGPT }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useLocalStorage } from "@vueuse/core";
export default defineComponent({
  data() {
    return {
      localAudio: useLocalStorage("localAudio", []),
    };
  },
});
</script>

<style></style>
