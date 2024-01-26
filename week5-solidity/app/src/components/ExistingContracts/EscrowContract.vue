<template>
  <v-card class="pa-2 ma-2 text-body-2" color="grey-lighten-2">
    <v-card-text>
      <!-- CONTRACT ADDRESS -->
      <v-row>
        <v-col cols="3" class="text-subtitle-2 text-grey-darken-4">
          {{ $t("home.contractList.contract.contract") }}
        </v-col>
        <v-col cols="9" class="text-body-2 text-truncate">
          <Address :address="escrow.contractAddress" />
        </v-col>
      </v-row>
      <!-- ARBITER -->
      <v-row>
        <v-col cols="3" class="text-subtitle-2 text-grey-darken-4">
          {{ $t("home.contractList.contract.arbiter") }}
        </v-col>
        <v-col cols="9" class="text-body-2 d-flex align-center">
          <Address :address="escrow.arbiter" />
        </v-col>
      </v-row>
      <!-- BENEFICIARY -->
      <v-row>
        <v-col cols="3" class="text-subtitle-2 text-grey-darken-4">
          {{ $t("home.contractList.contract.beneficiary") }}
        </v-col>
        <v-col cols="9" class="text-body-2 d-flex align-center">
          <Address :address="escrow.beneficiary" />
        </v-col>
      </v-row>
      <!-- VALUE -->
      <v-row>
        <v-col cols="3" class="text-subtitle-2 text-grey-darken-4">
          {{ $t("home.contractList.contract.value") }}
        </v-col>
        <v-col cols="9" class="text-body-2 d-flex align-center">
          {{ escrow.value }}
          <v-icon size="small">mdi-ethereum</v-icon>
        </v-col>
      </v-row>
      <!-- VALUE -->
      <v-row>
        <v-col cols="3" class="text-subtitle-2 text-grey-darken-4">
          {{ $t("home.contractList.contract.status") }}
        </v-col>
        <v-col cols="9" class="text-body-2 d-flex align-center">
          <div class="d-flex align-center">
            <v-chip
              prepend-icon="$vuetify"
              variant="elevated"
              class="mx-1"
              size="small"
              :color="escrow.isApproved ? 'success' : 'secondary'"
            >
              <div class="text-caption font-weight-bold text-white">
                <div>
                  {{
                    escrow.isApproved
                      ? $t("home.contractList.contract.statusValues.approved")
                      : $t("home.contractList.contract.statusValues.pending")
                  }}
                </div>
              </div>
              <template #prepend>
                <v-icon size="20">
                  {{ escrow.isApproved ? "mdi-check" : "mdi-receipt-clock" }}
                </v-icon>
              </template>
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-btn
      v-if="!escrow.isApproved"
      color="primary"
      class="ma-2"
      elevation="2"
      block
      prepend-icon="mdi-lock-open-variant"
      :disabled="!isArbiter || !isConnected"
      @click="approveEscrowContract(escrow.contractAddress)"
    >
      {{ $t("home.contractList.contract.button") }}
    </v-btn>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useWeb3ModalAccount } from "@web3modal/ethers5/vue";
import { useEscrowStore } from "@/store/escrow";
import { useNotificationStore } from "@/store/notification";
import { useI18n } from "vue-i18n";
import { approve, initialize } from "@/utils/ethers";
import { load } from "@/utils/lazy";

const Address = load(import("@/components/ExistingContracts/Address.vue"));

const props = defineProps({
  escrow: {
    type: Object,
    default: null,
    required: true,
  },
});

const { setIsApproved } = useEscrowStore();
const { notify } = useNotificationStore();
const { t } = useI18n();

const { address, isConnected } = useWeb3ModalAccount();

const isArbiter = computed(() =>
  address.value
    ? address.value.toLowerCase() === props.escrow.arbiter.toLowerCase()
    : false,
);

const approveEscrowContract = async (contractAddress) => {
  try {
    const escrowContract = await initialize(contractAddress);
    escrowContract.on("Approved", () => {
      notify("success", t("notifications.approve.success"));
      setIsApproved(contractAddress);
    });
    await approve(escrowContract);
    notify("info", t("notifications.approve.info"), false);
  } catch (error) {
    notify("error", t("notifications.approve.error", { e: error }));
  }
};
</script>
