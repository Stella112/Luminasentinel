/**
 * Lumina Sentinel — Solana Guardian Plugin
 *
 * Pure ESM module. Uses fetch() for all Solana RPC calls.
 * No external SDK imports — avoids all Bun/ESM resolution issues.
 *
 * The walletProvider injects REAL on-chain data into every message context,
 * so the LLM has actual wallet data and never hallucinates placeholders.
 */

import {
  type Plugin,
  type Provider,
  type ProviderResult,
  type Action,
  type IAgentRuntime,
  type Memory,
  type State,
} from "@elizaos/core";
import {
  getSOLBalance,
  getTokenAccounts,
  getPubkey,
  getRpc
} from "./utils/solana.js";

// ── Wallet Provider — injects live data into every message context ────────────

const walletProvider: Provider = {
  name: "lumina-wallet",
  description: "Provides real-time Solana wallet balance and token delegation data.",
  get: async (runtime: IAgentRuntime, _message: Memory, _state: State): Promise<ProviderResult> => {
    const settings = (key: string) => runtime.getSetting(key);
    const pubkey = getPubkey(settings);
    if (!pubkey) {
      return {
        text: "[LUMINA WALLET]: No SOLANA_PUBLIC_KEY configured.",
        values: { walletAddress: "NOT_CONFIGURED", solBalance: "0", delegations: "0" },
      };
    }

    const rpc = getRpc(settings);
    try {
      const [solBalance, tokenAccounts] = await Promise.all([
        getSOLBalance(rpc, pubkey),
        getTokenAccounts(rpc, pubkey),
      ]);
      const delegated = tokenAccounts.filter((a) => a.delegate !== null);
      const riskLines = delegated
        .slice(0, 5)
        .map((a) => `  • Mint: ${a.mint} | Delegate: ${a.delegate} | Amount: ${a.delegatedAmount}`)
        .join("\n");

      const text = `[LUMINA WALLET — REAL ON-CHAIN DATA]
Public Key: ${pubkey}
SOL Balance: ${solBalance.toFixed(4)} SOL
Token Accounts: ${tokenAccounts.length}
Active Delegations (risky approvals): ${delegated.length}
${delegated.length > 0 ? "Risky Delegations:\n" + riskLines : "No active delegations — wallet is clean ✅"}`;

      return {
        text,
        values: {
          walletAddress: pubkey,
          solBalance: solBalance.toFixed(4),
          tokenAccounts: tokenAccounts.length,
          delegations: delegated.length,
        },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        text: `[LUMINA WALLET]\nPublic Key: ${pubkey}\nRPC Error: ${msg}`,
        values: { walletAddress: pubkey, error: msg },
      };
    }
  },
};

// ── Action 1: GET_WALLET_ADDRESS ─────────────────────────────────────────────

const getWalletAddressAction: Action = {
  name: "GET_WALLET_ADDRESS",
  description: "Returns the configured Solana wallet public key.",
  similes: ["SHOW_WALLET", "MY_ADDRESS", "WALLET_ADDRESS", "SHOW_MY_WALLET", "WHAT_IS_MY_WALLET"],
  validate: async (runtime: IAgentRuntime) => !!getPubkey((key: string) => runtime.getSetting(key)),
  handler: async (
    runtime: IAgentRuntime,
    _message: Memory,
    _state?: State,
    _options?: Record<string, unknown>,
    callback?: (result: { text: string }) => void
  ): Promise<void> => {
    const pubkey = getPubkey((key: string) => runtime.getSetting(key));
    if (!pubkey) {
      callback?.({ text: "⚠️ No valid SOLANA_PUBLIC_KEY in .env." });
      return;
    }
    callback?.({
      text: `🔑 Your Solana wallet address is:\`${pubkey}\`\n\n🔗 [View on Solscan](https://solscan.io/account/${pubkey})`,
    });
  },
  examples: [],
};

// ── Action 2: CHECK_RISKY_APPROVALS ──────────────────────────────────────────

const checkRiskyApprovalsAction: Action = {
  name: "CHECK_RISKY_APPROVALS",
  description: "Scans the Solana wallet for active token delegations (risky approvals) in real-time.",
  similes: ["CHECK_APPROVALS", "RISKY_APPROVALS", "SCAN_WALLET", "CHECK_WALLET", "TOKEN_APPROVALS"],
  validate: async (runtime: IAgentRuntime) => !!getPubkey((key: string) => runtime.getSetting(key)),
  handler: async (
    runtime: IAgentRuntime,
    _message: Memory,
    _state?: State,
    _options?: Record<string, unknown>,
    callback?: (result: { text: string }) => void
  ): Promise<void> => {
    const pubkey = getPubkey((key: string) => runtime.getSetting(key));
    if (!pubkey) {
      callback?.({ text: "⚠️ No SOLANA_PUBLIC_KEY configured." });
      return;
    }

    callback?.({ text: `🔍 Scanning wallet \`${pubkey}\` on-chain now...` });

    try {
      const rpc = getRpc((key: string) => runtime.getSetting(key));
      const tokenAccounts = await getTokenAccounts(rpc, pubkey);
      const delegated = tokenAccounts.filter((a) => a.delegate !== null);

      if (delegated.length === 0) {
        callback?.({
          text: `✅ *Wallet Scan Complete*\n\nWallet: \`${pubkey}\`\n${tokenAccounts.length} token account(s) scanned.\n\nNo risky delegations found — your wallet is clean! 🛡️`,
        });
        return;
      }

      const lines = delegated
        .map(
          (a, i) =>
            `${i + 1}. Mint: \`${a.mint}\`\n   Delegate: \`${a.delegate}\`\n   Approved Amount: ${a.delegatedAmount}\n   Account: \`${a.pubkey}\``
        )
        .join("\n\n");

      callback?.({
        text: `⚠️ *${delegated.length} Risky Approval(s) Found!*\n\nWallet: \`${pubkey}\`\n\n${lines}\n\n🛡️ Reply "revoke approval [account address]" to remove any delegation.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      callback?.({ text: `❌ Scan failed: ${msg}\n\nRPC may be rate-limited. Try again shortly.` });
    }
  },
  examples: [],
};

// ── Action 3: REVOKE_APPROVAL ─────────────────────────────────────────────────

const revokeApprovalAction: Action = {
  name: "REVOKE_APPROVAL",
  description: "Guides the user to revoke a specific token delegation from their Solana wallet.",
  similes: ["REVOKE", "CANCEL_APPROVAL", "SECURE_WALLET", "REMOVE_DELEGATE", "REVOKE_TOKEN"],
  validate: async (runtime: IAgentRuntime) => !!getPubkey((key: string) => runtime.getSetting(key)),
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: Record<string, unknown>,
    callback?: (result: { text: string }) => void
  ): Promise<void> => {
    const pubkey = getPubkey((key: string) => runtime.getSetting(key));
    if (!pubkey) {
      callback?.({ text: "⚠️ No SOLANA_PUBLIC_KEY configured." });
      return;
    }

    const text = (message.content?.text ?? "") as string;
    const addrMatch = text.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
    if (!addrMatch) {
      callback?.({
        text: `⚠️ Please specify which token account to revoke.\nExample: *revoke approval AbC123...xyz*\n\nRun "check risky approvals" first to see account addresses.`,
      });
      return;
    }

    const tokenAccount = addrMatch[0];
    callback?.({
      text: `🛡️ *Revoke Approval Ready*\n\nToken Account: \`${tokenAccount}\`\nOwner: \`${pubkey}\`\n\nTo execute on-chain:\n1. Open Phantom Wallet → Settings → Connected Apps → Revoke\n2. Or run in terminal: \`spl-token revoke ${tokenAccount}\`\n\nAfter revoking, run "check risky approvals" to confirm it's removed.`,
    });
  },
  examples: [],
};

// ── Plugin Export ─────────────────────────────────────────────────────────────

export const customPlugin: Plugin = {
  name: "sentinel-plugin",
  description: "Lumina Sentinel — Real Solana Guardian with fetch-based RPC and security actions",
  providers: [walletProvider],
  actions: [getWalletAddressAction, checkRiskyApprovalsAction, revokeApprovalAction],
  evaluators: [],
};

export default customPlugin;
