/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "@/plugins/vuetify";
import i18n from "@/plugins/i18n";
import pinia from "@/store";
import router from "@/router";

import { initWeb3Modal } from "@/plugins/web3modal";

export function registerPlugins(app) {
  app.use(vuetify).use(i18n).use(router).use(pinia);

  initWeb3Modal();
}
