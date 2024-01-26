import { defineStore } from "pinia";

function defaultState() {
  return {
    notification: null,
  };
}

export const useNotificationStore = defineStore("notification", {
  state: () => defaultState(),
  actions: {
    reset() {
      Object.assign(this, defaultState());
    },
    notify(type, message, timeout = true) {
      this.notification = { type, message };
      if (timeout) {
        setTimeout(() => {
          this.reset();
        }, 5000);
      }
    },
  },
});
