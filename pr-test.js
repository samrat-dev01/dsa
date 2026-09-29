function badExample(input) {
  eval(input); // should trigger js/eval (security)
}

const apiKey1 = "sk_live_abcdef1234567890"; // should trigger universal/secret/generic-secret
const apiKey2 = "sk_live_abcdef1234567891"; // should trigger universal/secret/generic-secret
const apiKey3 = "sk_live_abcdef1234567892"; // should trigger universal/secret/generic-secret