<template>
  <v-card>
    <v-card-title> {{ $t("home.contractCreation.title") }} </v-card-title>

    <v-divider class="my-4"></v-divider>

    <v-card-text>
      <v-form v-model="valid" @submit.prevent="deployEscrowContract">
        <v-text-field
          v-model="arbiter"
          :rules="rules.ethereumAddress"
          :label="$t('home.contractCreation.form.labels.arbiter')"
          clearable
          prepend-icon="mdi-account-convert"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="beneficiary"
          :rules="rules.ethereumAddress"
          :label="$t('home.contractCreation.form.labels.beneficiary')"
          clearable
          prepend-icon="mdi-account-arrow-down"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="deposit"
          :rules="rules.numbers"
          :label="$t('home.contractCreation.form.labels.deposit')"
          clearable
          prepend-icon="mdi-cash-multiple"
          append-inner-icon="mdi-ethereum"
          variant="outlined"
        ></v-text-field>

        <v-btn
          color="secondary"
          class="mx-auto my-4"
          elevation="2"
          block
          prepend-icon="mdi-cloud-upload"
          :disabled="!valid"
          @click="deployEscrowContract"
        >
          {{ $t("home.contractCreation.form.button") }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useEscrowStore } from "@/store/escrow";
import { useNotificationStore } from "@/store/notification";
import { useI18n } from "vue-i18n";
import { ethereumAddress, numbers } from "@/utils/validators";
import { deploy, parseEther } from "@/utils/ethers";

const { addEscrow } = useEscrowStore();
const { notify } = useNotificationStore();
const { t } = useI18n();

const arbiter = ref("");
const beneficiary = ref("");
const deposit = ref(null);

const valid = ref(false);
const rules = {
  ethereumAddress,
  numbers,
};

const deployEscrowContract = async () => {
  try {
    const value = parseEther(deposit.value);

    const escrowContract = await deploy(
      arbiter.value,
      beneficiary.value,
      value,
    );

    notify("info", t("notifications.deploy.info"), false);
    await escrowContract.deployed();
    notify("success", t("notifications.deploy.success"));

    const escrow = {
      contractAddress: escrowContract.address,
      arbiter: arbiter.value,
      beneficiary: beneficiary.value,
      value: deposit.value.toString(),
      isApproved: false,
    };

    addEscrow(escrow);
  } catch (error) {
    notify("error", t("notifications.deploy.error", { e: error }));
  }
};
</script>
