<template>
  <div>
    <audio-recorder> </audio-recorder>
    <audio-transcripts></audio-transcripts>
  </div>
</template>

<script lang="ts">
import AudioRecorder from "@/components/AudioRecorder.vue";
import AudioTranscripts from "@/components/AudioTranscripts.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { AudioRecorder, AudioTranscripts },
  name: "MainView",
});
</script>
