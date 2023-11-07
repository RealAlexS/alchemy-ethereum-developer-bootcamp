import { defineStore } from "pinia";

function defaultState() {
  return {
    latestBlockNumber: null,
    block: {},
    transactionReceipts: [],
  };
}

export const useAppStore = defineStore("app", {
  state: () => defaultState(),
  actions: {
    reset() {
      Object.assign(this, defaultState());
    },
    setLatestBlockNumber(payload) {
      this.latestBlockNumber = payload;
    },
    setBlock(payload) {
      this.block = payload;
    },
    setTransactionReceipts(payload) {
      this.transactionReceipts = payload;
    },
  },
});
