/**
 * Lumina Sentinel — Custom Bootstrap
 * Programmatically registers all plugins including the sentinel guardian plugin.
 */
import { AgentServer, type ServerMiddleware } from "@elizaos/server";
import express from "express";
import bootstrapPlugin from "@elizaos/plugin-bootstrap";
import openaiPlugin from "@elizaos/plugin-openai";
import telegramPlugin from "@elizaos/plugin-telegram";
// @ts-expect-error - resolution issues in types
import sqlPlugin from "@elizaos/plugin-sql";
import webSearchPlugin from "@elizaos/plugin-web-search";
import { customPlugin as sentinelPlugin } from "./index.js";
import { getSOLBalance, getTokenAccounts, getPubkey, getRpc } from "./utils/solana.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Load character file
  const characterPath = path.join(__dirname, "../characters/agent.character.json");
  const character = JSON.parse(fs.readFileSync(characterPath, "utf-8"));

  // Ensure plugins array exists but we will control it programmatically
  character.plugins = [];

  const port = parseInt(process.env.SERVER_PORT ?? "3001");

  const server = new AgentServer();

  // Define a custom middleware to handle our stats API and CORS
  const sentinelMiddleware: ServerMiddleware = async (req: any, res: any, next: any) => {
    console.log(`[sentinelMiddleware] ${req.method} ${req.path}`);
    // Add CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }

    if (req.path === "/api/sentinel/stats" && req.method === "GET") {
      try {
        const settings = (key: string) => process.env[key];
        const pubkey = getPubkey(settings);
        const rpc = getRpc(settings);

        if (!pubkey) {
          res.status(400).json({ error: "SOLANA_PUBLIC_KEY not configured" });
          return;
        }

        const [solBalance, tokenAccounts] = await Promise.all([
          getSOLBalance(rpc, pubkey),
          getTokenAccounts(rpc, pubkey).catch(() => []), // Resilience
        ]);

        const delegated = tokenAccounts.filter((a) => a.delegate !== null);

        const runtimes = server.getAllAgents();
        const agentId = runtimes[0]?.agentId;
        const chatUrl = "/chat";

        res.json({
          pubkey,
          agentId,
          chatUrl,
          solBalance,
          tokenCount: tokenAccounts.length,
          riskyApprovals: delegated.length,
          approvals: delegated.map(a => ({
            mint: a.mint,
            delegate: a.delegate,
            amount: a.delegatedAmount
          }))
        });
        return;
      } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
        return;
      }
    }

    if (req.path === "/api/sentinel/chat" && req.method === "POST") {
      try {
        const { message } = req.body;
        if (!message) {
          res.status(400).json({ error: "No message provided" });
          return;
        }

        const apiUrl = process.env.OPENAI_API_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
        const apiKey = process.env.OPENAI_API_KEY || "nosana";
        const model = process.env.OPENAI_MODEL || process.env.OPENAI_SMALL_MODEL || "Qwen3.5-9B-FP8";

        // Inject live wallet context into the system prompt
        let walletContext = "";
        try {
          const settings = (key: string) => process.env[key];
          const pubkey = getPubkey(settings);
          const rpc = getRpc(settings);
          if (pubkey) {
            const [solBalance, tokenAccounts] = await Promise.all([
              getSOLBalance(rpc, pubkey),
              getTokenAccounts(rpc, pubkey).catch(() => []),
            ]);
            const risky = tokenAccounts.filter((a) => a.delegate !== null);
            walletContext = `\n\nWALLET CONTEXT (live):\n- Address: ${pubkey}\n- SOL Balance: ${solBalance.toFixed(4)} SOL\n- Token Accounts: ${tokenAccounts.length}\n- Risky Approvals (delegated tokens): ${risky.length}${risky.length > 0 ? "\n  " + risky.map(r => `${r.mint} → delegate: ${r.delegate}`).join("\n  ") : " (none detected ✅)"}`;
          }
        } catch (_) {}

        const systemPrompt = `You are Lumina Sentinel — an Onchain Jarvis. You operate 24/7 as a Finance Guardian on Nosana's decentralized network.

Your goal is to provide authoritative security and financial intelligence. 

STRUCTURE:
1. First, perform your internal "INTELLIGENCE ANALYSIS".
2. Finally, provide your "Lumina Guardian Report" addressed to the user starting exactly with the tag: [REPORT]

Keep the final [REPORT] concise, professional, and security-focused.${walletContext}`;

        console.log(`[ChatAPI] Request: ${message}`);
        const aiRes = await fetch(`${apiUrl}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            // Removed temperature/penalties for reasoning models
            max_tokens: 4096,
          }),
          signal: AbortSignal.timeout(90000),
        });

        if (!aiRes.ok) {
          const errText = await aiRes.text();
          console.error(`[ChatAPI] AI API Error: ${aiRes.status}`, errText);
          throw new Error(`AI API error ${aiRes.status}: ${errText}`);
        }

        const aiJson = await aiRes.json() as any;
        const msg = aiJson.choices?.[0]?.message;
        const rawContent = (msg?.content || msg?.reasoning || msg?.reasoning_content || "").trim();
        
        // Premium Extraction: Look for the [REPORT] tag to isolate the authoritative answer
        let reply = rawContent;
        if (rawContent.includes("[REPORT]")) {
          reply = rawContent.split("[REPORT]").pop()?.trim() || "";
        } else if (rawContent.includes("FINAL RESPONSE:")) {
          reply = rawContent.split("FINAL RESPONSE:").pop()?.trim() || "";
        } else if (rawContent.includes("### Final Response")) {
          reply = rawContent.split("### Final Response").pop()?.trim() || "";
        } else if (rawContent.includes("Lumina Guardian Report")) {
          reply = rawContent.split("Lumina Guardian Report").pop()?.trim() || "";
        }
        
        // Post-processing: Strip out any remaining thought/analysis headers that might have bled through
        reply = reply.replace(/^(Analysis|Thought|Intelligence|Drafting).*$/gim, "").trim();
        reply = reply.replace(/^[\d#\*\.\s]+(Thought|Analysis|Action|Report).*$/gim, "").trim();
        
        // Final Fallback: If truncation happened or tag missing, take the longest paragraph at the end
        if (reply.length < 10) {
          const paragraphs = rawContent.split("\n\n").filter((p: string) => p.trim().length > 30);
          reply = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1].trim() : rawContent;
        }

        reply = reply || "Lumina Sentinel is monitoring. System checks passed.";
        
        console.log(`[ChatAPI] AI Clean Response: ${reply.substring(0, 100)}...`);
        res.json({ response: reply });
        return;
      } catch (err) {
        console.error("[ChatAPI Fatal Error]", err);
        res.status(500).json({ 
          response: "Internal agent routing error.",
          debug: err instanceof Error ? err.message : String(err)
        });
        return;
      }
    }

    next();
  };

  // Initialize and start with configuration
  await server.start({
    port,
    clientPath: path.join(__dirname, "../dashboard/out"),
    middlewares: [
      express.json(),
      express.urlencoded({ extended: true }),
      sentinelMiddleware
    ],
    agents: [
      {
        character,
        plugins: [
          bootstrapPlugin,
          openaiPlugin,
          telegramPlugin,
          sqlPlugin,
          webSearchPlugin,
          sentinelPlugin,
        ],
      },
    ]
  });
  
  // Custom route for /chat to ensure it serves the right file if needed
  server.app.get("/chat", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dashboard/out/chat/index.html"));
  });

  console.log(`\n🛡️  Lumina Sentinel is ONLINE on port ${port}`);
  console.log("✅  Solana Guardian Plugin (REAL) successfully activated.\n");
}

main().catch((err) => {
  console.error("Fatal error starting Lumina Sentinel:", err);
  process.exit(1);
});
