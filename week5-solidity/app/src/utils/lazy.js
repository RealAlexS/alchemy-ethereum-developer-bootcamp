import { defineAsyncComponent } from "vue";

export const load = (statement) => defineAsyncComponent(() => statement);
