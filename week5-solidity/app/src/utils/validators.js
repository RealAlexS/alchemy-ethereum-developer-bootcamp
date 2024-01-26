import i18n from "@/plugins/i18n";
const { t } = i18n.global;

const required = [(v) => !!v || t("validators.required")];

const hardRequired = [(v) => !!v?.trim() || t("validators.required")];

const boolean = [(v) => typeof v === "boolean" || t("validators.required")];

const alpha = [
  (v) => /^[\p{L}\p{M}\p{Zs}]+$/u.test(v) || t("validators.names.alpha"),
];

const alphanumeric = [
  (v) => !!v || t("validators.alphanumField.required"),
  (v) =>
    /^[\p{L}\p{M}\p{Zs}\d+]+$/u.test(v) ||
    t("validators.alphanumField.alphanum"),
];

const numbers = [
  (v) => !!v || t("validators.generic.required"),
  (v) => /^[0-9.]*$/i.test(v) || t("validators.generic.numbers"),
];

const textarea = [
  (v) => !!v || t("validators.generic.required"),
  (v) => /^(\S+)/i.test(v) || t("validators.generic.alphanumeric"),
];

const url = [
  (v) => !!v || t("validators.url.required"),
  (v) =>
    /^[https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)]?$/i.test(
      v,
    ) || t("validators.url.valid"),
];

const ethereumAddress = [
  (v) => /^0x[a-fA-F0-9]{40}$/.test(v) || t("validators.ethereumAddress"),
];

export {
  required,
  hardRequired,
  boolean,
  alpha,
  numbers,
  textarea,
  alphanumeric,
  url,
  ethereumAddress,
};
