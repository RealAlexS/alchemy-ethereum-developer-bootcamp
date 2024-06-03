import { defineStore } from "pinia";

function defaultState() {
  return {
    tokenBalances: [],
    tokenMetadata: [],
  };
}

export const useAppStore = defineStore("app", {
  state: () => defaultState(),
  actions: {
    reset() {
      Object.assign(this, defaultState());
    },
    setTokenBalances(payload) {
      this.tokenBalances = payload;
    },
    setTokenMetadata(payload) {
      this.tokenMetadata = payload;
    },
  },
});
