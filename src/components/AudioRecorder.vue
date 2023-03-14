<template>
  <div class="flex flex-col gap-4 text-center">
    <div>
      <button @click="enabled = !enabled">
        {{ enabled ? "Stop" : "Start" }}
      </button>
    </div>

    <div>
      <div
        v-for="camera of cameras"
        :key="camera.deviceId"
        class="px-2 py-1 cursor-pointer"
        :class="{ 'text-primary': currentCamera === camera.deviceId }"
        @click="currentCamera = camera.deviceId"
      >
        {{ camera.label }}
      </div>
    </div>
    <div>
      <video ref="video" muted autoplay controls class="h-100 w-auto" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watchEffect } from "vue";
import { useDevicesList, useUserMedia } from "@vueuse/core";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const currentCamera = ref<string>("default");
    const currentMicrophone = ref<string>("default");
    const { videoInputs: cameras, audioInputs: microphones } = useDevicesList({
      requestPermissions: true,
      onUpdated() {
        if (!cameras.value.find((i) => i.deviceId === currentCamera.value)) {
          currentCamera.value = cameras.value[0]?.deviceId || "";
          currentMicrophone.value = microphones.value[0]?.deviceId || "";
        }
      },
    });
    const video = ref<HTMLVideoElement>();
    const { stream } = useUserMedia({
      constraints: {
        video: { deviceId: currentCamera.value },
        audio: { deviceId: currentMicrophone.value },
      },
    });
    watchEffect(() => {
      if (video.value) video.value.srcObject = stream.value!;
    });
  },
});
</script>
