<template>
  <div class="d-flex justify-center float w-100">
    <v-btn
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
import { Storage } from "@capacitor/storage";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      isRecording: false,
      audioUrl: null,
      localAudio: [],
    };
  },
  async mounted() {
    const ret = await Storage.get({ key: "localAudio" });
    this.localAudio = JSON.parse(ret.value) || [];

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.addEventListener("dataavailable", (event) => {
        this.audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/ogg" });
        this.saveAudio(audioBlob);
        this.whisper(audioBlob);
      });
    });
  },
  methods: {
    async saveAudio(blob) {
      this.audioUrl = URL.createObjectURL(blob);
      const transcriptions = await this.whisper(blob);
      const chatGPT = await this.askGPT(transcriptions.text);
      this.localAudio.push({ audio: this.audioUrl, transcriptions, chatGPT });
      await Storage.set({
        key: "localAudio",
        value: JSON.stringify(this.localAudio),
      });
      this.$emit("update-records");
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
    async whisper(blob) {
      const url = "https://api.openai.com/v1/audio/transcriptions";
      const token = process.env.VUE_APP_OPENAI_TOKEN; // Replace TOKEN with your OpenAI API token
      const model = "whisper-1";

      const formData = new FormData();
      formData.append("file", blob, "audio.mp3");
      formData.append("model", model);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },

    async askGPT(transcription) {
      const url = "https://api.openai.com/v1/chat/completions";
      const token = process.env.VUE_APP_OPENAI_TOKEN; // Replace TOKEN with your OpenAI API token
      const model = "gpt-3.5-turbo";
      const prompt =
        "Answer using a number only. Positive social interactions are interactions that promote the wellbeing of everyone involved, and lead to the ongoing development of social skills that encourage the parties to communicate respectfully and feel accepted by each other. Use this definition rate on a scale from 1-100 the following social interaction: ";
      const formData = {
        messages: [
          { role: "user", content: prompt + "'" + transcription + "'" },
        ],
        model: model,
      };

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const content = response.data.choices[0].message.content;

      return parseInt(content.match(/\d+/)[0]);
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
