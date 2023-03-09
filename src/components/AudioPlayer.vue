<template>
  <div class="audio-player">
    <v-slider v-model="currentTime" :max="duration" class="mb-3"></v-slider>
    <div class="d-flex justify-center">
      <v-btn icon @click="playPause">
        <v-icon>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
      </v-btn>
      <v-btn icon @click="stop">
        <v-icon>mdi-stop</v-icon>
      </v-btn>
    </div>
    <audio
      ref="audio"
      :src="src"
      @timeupdate="updateTime"
      @ended="stop"
    ></audio>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  setup() {
    const audio = ref(null);

    return {
      audio,
    };
  },
  data() {
    return {
      playing: false,
      currentTime: 0,
      duration: 0,
    };
  },
  methods: {
    playPause() {
      if (this.playing) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.playing = !this.playing;
    },
    stop() {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.playing = false;
      this.currentTime = 0;
    },
    updateTime() {
      this.currentTime = this.audio.currentTime;
      this.duration = this.audio.duration;
    },
  },
};
</script>

<style scoped>
.audio-player {
  padding: 20px;
}
</style>
