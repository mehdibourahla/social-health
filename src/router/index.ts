import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainView from "../views/MainView.vue";
import SocialHealthView from "../views/SocialHealthView.vue";
import ChatView from "../views/ChatView.vue";
import YamnetView from "../views/YamnetView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "main",
    component: MainView,
  },
  {
    path: "/social-health",
    name: "SocialHealth",
    component: SocialHealthView,
  },
  {
    path: "/chat",
    name: "Chat",
    component: ChatView,
  },
  {
    path: "/yamnet",
    name: "Yamnet",
    component: YamnetView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
