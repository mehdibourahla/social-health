<template>
  <div>
    <v-container class="pa-6">
      <v-row>
        <v-col
          v-for="menu in menus"
          :key="menu.name"
          class="text-center my-2"
          cols="4"
        >
          <v-card
            class="rounded-lg"
            :class="{ 'work-in-progress-btn': !menu.status }"
            :to="{ name: menu.redirection }"
            :color="menu.color"
            :disabled="!menu.status"
          >
            <v-icon size="64" color="white">
              {{ menu.icon }}
            </v-icon>
          </v-card>
          <div class="text-caption font-weight-bold pt-2">
            {{ menu.name }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      menus: [
        {
          name: "YAMNet",
          color: "#457B9D",
          icon: "mdi-headphones",
          redirection: "Yamnet",
          status: true,
        },
        {
          name: "Chat GPT",
          color: "#457B9D",
          icon: "mdi-robot",
          redirection: "Chat",
          status: false,
        },
        {
          name: "Social Health",
          color: "#CB6584",
          icon: "mdi-account-child-circle",
          redirection: "SocialHealth",
          status: true,
        },
      ],
    };
  },
});
</script>

<style lang="scss">
.work-in-progress-btn {
  position: relative !important;
  background-color: #f5e617 !important;
  opacity: 0.9 !important;
  background-image: linear-gradient(135deg, #f1f1f1 25%, transparent 25%),
    linear-gradient(225deg, #f1f1f1 25%, transparent 25%),
    linear-gradient(45deg, #f1f1f1 25%, transparent 25%),
    linear-gradient(315deg, #f1f1f1 25%, #f5e617 25%) !important;
  background-position: 40px 0, 40px 0, 0 0, 0 0 !important;
  background-size: 80px 80px !important;
  background-repeat: repeat !important;
}
.home-tile {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}
</style>
