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
            class="home-tile rounded-lg"
            :to="{ name: menu.redirection }"
            :color="menu.color"
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
          name: "Chat GPT",
          color: "#457B9D",
          icon: "mdi-robot",
          redirection: "",
        },
        {
          name: "Social Health",
          color: "#CB6584",
          icon: "mdi-account-child-circle",
          redirection: "SocialHealth",
        },
      ],
    };
  },
});
</script>

<style lang="scss">
.home-tile {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}
</style>
