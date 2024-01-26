import { defineStore } from "pinia";

function defaultState() {
  return {
    escrows: [],
  };
}

export const useEscrowStore = defineStore("escrow", {
  state: () => defaultState(),
  actions: {
    reset() {
      Object.assign(this, defaultState());
    },
    addEscrow(escrow) {
      this.escrows.push(escrow);
    },
    updateEscrow(escrow) {
      const index = this.escrows.findIndex((e) => e.address === escrow.address);
      this.escrows[index] = escrow;
    },
    setIsApproved(contractAddress) {
      const index = this.escrows.findIndex(
        (e) => e.contractAddress === contractAddress,
      );
      this.escrows[index].isApproved = true;
    },
  },
});
