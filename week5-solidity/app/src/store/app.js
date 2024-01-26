import { defineStore } from "pinia";

function defaultState() {
  return {};
}

export const useAppStore = defineStore("app", {
  state: () => defaultState(),
  actions: {
    reset() {
      Object.assign(this, defaultState());
    },
  },
});
