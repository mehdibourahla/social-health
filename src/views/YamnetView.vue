<template>
  <div>
    <div id="word-cloud"></div>
    <audio-recorder :loading="loading" @get-audio="addTranscript">
    </audio-recorder>
  </div>
</template>

<script>
import AudioRecorder from "@/components/AudioRecorder.vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import * as d3 from "d3";
import d3Cloud from "d3-cloud";

export default defineComponent({
  components: { AudioRecorder },
  name: "YamnetView",

  data() {
    return {
      loading: false,
      localAudio: [],
      words: [],
      layout: null,
    };
  },

  async mounted() {
    await this.refresh();
    const svg = d3
      .select("#word-cloud")
      .append("svg")
      .attr("viewBox", [0, 0, 640, 400])
      .attr("width", 640)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    this.layout = svg.append("g").attr("transform", `translate(${0},${0})`);
  },

  watch: {
    words(words) {
      this.plotWordCloud(words);
    },
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
      formData.append("audio_data", audio, "audio.wav");
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      this.words = response.data;
    },

    plotWordCloud(words) {
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      this.layout.selectAll("*").remove();
      const cloud = d3Cloud()
        .size([640, 400])
        .words(words.map((d) => ({ text: d.class, size: d.prob * 100 })))
        .padding(0)
        .rotate(0)
        .font("sans-serif")
        .fontSize((d) => Math.sqrt(d.size) * 48)
        .on("word", ({ size, x, y, rotate, text }) => {
          this.layout
            .append("text")
            .attr("font-size", size)
            .style("fill", () =>
              colorScale(words.findIndex((obj) => obj.class == text))
            )
            .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
            .text(text);
        });

      cloud.start();
    },
    drawWordCloud(words) {
      d3.select("#word-cloud")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(250,250)")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style("fill", (d) => d3.schemeCategory10[d.size % 10])
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${[d.x, d.y]})`)
        .text((d) => d.text);
    },
  },
});
</script>
