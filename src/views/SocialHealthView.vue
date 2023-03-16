<template>
  <div>
    <audio-transcripts
      :localAudio="localAudio"
      class="mb-12"
      @delete-transcript="deleteTranscript"
    ></audio-transcripts>

    <audio-recorder @update-records="addTranscript"> </audio-recorder>
  </div>
</template>

<script>
import AudioRecorder from "@/components/AudioRecorder.vue";
import AudioTranscripts from "@/components/AudioTranscripts.vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";

export default defineComponent({
  components: { AudioRecorder, AudioTranscripts },
  name: "SocialHealth",

  data() {
    return {
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
        key: "localAudio",
        value: JSON.stringify(this.localAudio),
      });
    },
    async addTranscript(transcript) {
      this.localAudio.unshift(transcript);
      await Storage.set({
        key: "localAudio",
        value: JSON.stringify(this.localAudio),
      });
    },
    async refresh() {
      const ret = await Storage.get({ key: "localAudio" });
      this.localAudio = JSON.parse(ret.value) || [];
      if (this.localAudio.length > 0) {
        this.localAudio.sort((a, b) => b.id - a.id);
      }
    },
  },
});
</script>
