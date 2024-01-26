<template>
  <div v-if="snackbar" class="text-center">
    <v-snackbar
      v-model="snackbar"
      multi-line
      location="top center"
      min-width="400"
      :color="color"
      rounded
    >
      {{ message }}

      <template #actions>
        <v-btn color="red-darken-2" variant="text" @click="reset">
          {{ $t("notifications.close") }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useNotificationStore } from "@/store/notification";
import { storeToRefs } from "pinia";

const { notification } = storeToRefs(useNotificationStore());

const { reset } = useNotificationStore();

const snackbar = computed(() => !!notification.value);

const colors = {
  error: "red",
  success: "green",
  info: "blue",
};

const color = computed(() => colors[notification.value?.type]);

const message = computed(() => notification.value?.message);
</script>
