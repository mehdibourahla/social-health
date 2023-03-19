<template>
  <div>
    <audio-transcripts
      :localAudio="localAudio"
      class="mb-12"
      @delete-transcript="deleteTranscript"
    ></audio-transcripts>

    <audio-recorder :loading="loading" @get-audio="addTranscript">
    </audio-recorder>
  </div>
</template>

<script>
import AudioRecorder from "@/components/AudioRecorder.vue";
import AudioTranscripts from "@/components/AudioTranscripts.vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import axios from "axios";

export default defineComponent({
  components: { AudioRecorder, AudioTranscripts },
  name: "SocialHealth",

  data() {
    return {
      loading: false,
      localAudio: [],
    };
  },

  async mounted() {
    await this.refresh();
  },

  methods: {
    async deleteTranscript(id) {
      this.localAudio = this.localAudio.filter((audio) => audio.id != id);
      await Storage.set({
        key: "SocialHealth",
        value: JSON.stringify(this.localAudio),
      });
    },
    async addTranscript(audio) {
      this.loading = true;
      const transcriptions = await this.whisper(audio);
      const chatGPT = await this.askGPT(transcriptions.text);

      this.localAudio.unshift({
        id: Date.now(),
        transcriptions,
        chatGPT,
      });

      await Storage.set({
        key: "SocialHealth",
        value: JSON.stringify(this.localAudio),
      });
      this.loading = false;
    },
    async refresh() {
      const ret = await Storage.get({ key: "SocialHealth" });
      this.localAudio = JSON.parse(ret.value) || [];
      if (this.localAudio.length > 0) {
        this.localAudio.sort((a, b) => b.id - a.id);
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
