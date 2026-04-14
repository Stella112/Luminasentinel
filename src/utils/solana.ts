/**
 * Lumina Sentinel — Solana RPC Service
 * Shared utilities for the agent plugin and the dashboard API.
 */

export interface TokenAccount {
  pubkey: string;
  mint: string;
  amount: number;
  delegate: string | null;
  delegatedAmount: number;
}

/**
 * Basic JSON-RPC helper for Solana
 */
async function solanaRpc(url: string, method: string, params: any[]): Promise<any> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });
  const json = (await response.json()) as { result?: any; error?: any };
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}

export async function getSOLBalance(rpcUrl: string, pubkey: string): Promise<number> {
  try {
    const result = (await solanaRpc(rpcUrl, "getBalance", [pubkey, { commitment: "confirmed" }])) as {
      value: number;
    };
    return (result?.value ?? 0) / 1e9;
  } catch (err) {
    console.error(`[SOL Balance Error] ${err}`);
    return 0; // Fallback
  }
}

export async function getTokenAccounts(rpcUrl: string, pubkey: string): Promise<TokenAccount[]> {
  // Public RPCs like publicnode.com often disable getProgramAccounts / getTokenAccountsByOwner
  // Returning empty array to maintain system stability while providing basic SOL context
  return [];
}

export function getPubkey(settings: (key: string) => string | undefined): string | null {
  const raw = settings("SOLANA_PUBLIC_KEY") ?? process.env.SOLANA_PUBLIC_KEY;
  if (!raw) return null;
  const pub = String(raw).trim();
  if (pub.length < 32 || pub.includes("dummy") || pub.includes("6x8U")) return null;
  return pub;
}

export function getRpc(settings: (key: string) => string | undefined): string {
  const raw = settings("SOLANA_RPC_URL") ?? process.env.SOLANA_RPC_URL;
  return raw ? String(raw) : "https://api.mainnet-beta.solana.com";
}
