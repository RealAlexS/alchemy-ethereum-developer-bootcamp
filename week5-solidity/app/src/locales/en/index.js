import validators from "@/locales/en/validators";
import notifications from "@/locales/en/notifications";

export default {
  notifications,
  validators,
  appBar: {
    title: "Escrow Contract Manager",
  },
  home: {
    contractCreation: {
      title: "Create Escrow Contract",
      form: {
        labels: {
          arbiter: "Arbiter Address",
          beneficiary: "Beneficiary Address",
          deposit: "Deposit Amount",
        },
        button: "Deploy",
      },
    },
    contractList: {
      title: "Existing Escrow Contracts",
      searchContracts: {
        search: "Search Contracts By Depositor Address",
      },
      contract: {
        contract: "Contract",
        arbiter: "Arbiter",
        beneficiary: "Beneficiary",
        value: "Value",
        status: "Status",
        statusValues: {
          pending: "Pending",
          approved: "Approved",
        },
        button: "Approve",
      },
    },
  },
};
