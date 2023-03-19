<template>
  <div class="d-flex justify-center float w-100">
    <v-btn
      :loading="loading"
      :disabled="loading"
      @click="toggleRecording"
      size="x-large"
      :icon="isRecording ? 'mdi-stop' : 'mdi-microphone'"
      :color="isRecording ? 'red' : 'blue'"
    >
    </v-btn>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      isRecording: false,
      audioUrl: null,
    };
  },
  async mounted() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.addEventListener("dataavailable", (event) => {
        this.audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
        this.saveAudio(audioBlob);
      });
    });
  },
  methods: {
    saveAudio(audio) {
      this.audioUrl = URL.createObjectURL(audio);
      this.$emit("get-audio", audio);
    },
    toggleRecording() {
      if (this.isRecording) {
        this.isRecording = false;
        this.mediaRecorder.stop();
      } else {
        this.audioChunks = [];
        this.isRecording = true;
        this.mediaRecorder.start();
      }
    },
  },
});
</script>

<style>
.float {
  position: fixed;
  bottom: 1.5rem;
  z-index: 9999;
}
</style>
