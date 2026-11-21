import { getCivitaiApiKey } from "./guest/db";

/**
 * The user's CivitAI API token, saved locally via Settings → API Keys.
 * Falls back to CIVITAI_API_KEY for `pnpm dev`. Required for the CivitAI
 * Orchestration backend, which runs community checkpoints on Civitai's workers.
 */
export async function getCivitaiKeyForUser(..._args: unknown[]): Promise<string | null> {
  return getCivitaiApiKey();
}
