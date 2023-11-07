import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Index.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/blocks",
        name: "Blocks",
        component: () => import("@/views/Blocks.vue"),
      },
      {
        path: "/block/:blockNumber",
        name: "Block",
        component: () => import("@/views/Block/Index.vue"),
      },
      {
        path: "/block/:blockNumber/txs",
        name: "BlockTransactions",
        component: () => import("@/views/Block/Txs.vue"),
      },
      {
        path: "/tx/:txHash",
        name: "Tx",
        component: () => import("@/views/Tx.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

export default router;
