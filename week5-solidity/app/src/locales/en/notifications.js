export default {
  close: "close",
  deploy: {
    info: "Deploying contract...",
    success: "Contract successfully deployed 💪",
    error: (e) => `Deployment Error: ${e.named("e")}`,
  },
  approve: {
    info: "Approving transfer...",
    success: "Transfer successfully approved 💪",
    error: (e) => `Approval Error: ${e.named("e")}`,
  },
};
