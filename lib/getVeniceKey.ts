import { getVeniceApiKey } from "./guest/db";

/**
 * The user's Venice AI API key, saved locally via Settings → API Keys.
 * Falls back to VENICE_API_KEY for `pnpm dev`.
 */
export async function getVeniceKeyForUser(..._args: unknown[]): Promise<string | null> {
  return getVeniceApiKey();
}
