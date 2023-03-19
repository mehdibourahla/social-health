<template>
  <div>
    <audio-recorder :loading="loading" @get-audio="addTranscript">
    </audio-recorder>
  </div>
</template>

<script>
import AudioRecorder from "@/components/AudioRecorder.vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import axios from "axios";

export default defineComponent({
  components: { AudioRecorder },
  name: "YamnetView",

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
        key: "YAMNet",
        value: JSON.stringify(this.localAudio),
      });
    },
    async addTranscript(audio) {
      this.loading = true;
      this.yamnetInference(audio);
      // this.localAudio.unshift({
      //   id: Date.now(),
      // });

      // await Storage.set({
      //   key: "YAMNet",
      //   value: JSON.stringify(this.localAudio),
      // });
      this.loading = false;
    },
    async refresh() {
      const ret = await Storage.get({ key: "YAMNet" });
      this.localAudio = JSON.parse(ret.value) || [];
      if (this.localAudio.length > 0) {
        this.localAudio.sort((a, b) => b.id - a.id);
      }
    },

    async yamnetInference(audio) {
      const url = "http://127.0.0.1:5000/classify";
      let formData = new FormData();
      formData.append("audio_data", audio.audio, "audio.wav");
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => console.log("Audio upload successful."))
        .catch((error) => console.error("Error uploading audio:", error));
    },
  },
});
</script>
