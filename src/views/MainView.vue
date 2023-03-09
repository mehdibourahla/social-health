<template>
  <div>
    <audio-transcripts
      :localAudio="localAudio"
      class="mb-12"
    ></audio-transcripts>

    <audio-recorder @update-records="refresh()"> </audio-recorder>
  </div>
</template>

<script>
import AudioRecorder from "@/components/AudioRecorder.vue";
import AudioTranscripts from "@/components/AudioTranscripts.vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";

export default defineComponent({
  components: { AudioRecorder, AudioTranscripts },
  name: "MainView",

  data() {
    return {
      localAudio: [],
    };
  },

  async mounted() {
    await this.refresh();
  },

  methods: {
    async refresh() {
      const ret = await Storage.get({ key: "localAudio" });
      this.localAudio = JSON.parse(ret.value).reverse();
    },
  },
});
</script>
