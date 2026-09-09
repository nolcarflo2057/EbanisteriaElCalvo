// White‑label assistant whitelist – tools that the agent may invoke safely
export const whiteLabelAgentPermissions = {
  // Allowed tool commands (exact strings as they appear in the CLI)
  tools: [
    "graphify query",
    "read_file",
    "blackbox", // allow Blackbox AI CLI
  ],
};
