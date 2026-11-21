// ─────────────────────────────────────────────────────────────────────────────
// PROVIDERS — single source of truth for per-model backend selection
// (Kie.ai / Azure Foundry / Codex CLI / Venice AI / CivitAI), shared by the
// Settings modal, the workflow GenerateNode, and the gallery generation composer.
//
// A model advertises which backends it can route to via `providerChoices` in
// `lib/modelConfig.ts`. Models without it are Kie.ai-only; models with a single
// entry (Venice/CivitAI community checkpoints) route there without a toggle.
// ─────────────────────────────────────────────────────────────────────────────
import { IMAGE_MODELS } from "@/lib/modelConfig";

export const PROVIDERS = [
  { id: "kie",     label: "Kie.ai" },
  { id: "azure",   label: "Azure Foundry" },
  { id: "codex",   label: "Codex CLI" },
  { id: "venice",  label: "Venice AI" },
  { id: "civitai", label: "CivitAI" },
] as const;

export type ProviderId = (typeof PROVIDERS)[number]["id"];

const STORAGE_KEY = "aiui-model-providers";

export function loadModelProviders(): Record<string, ProviderId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveModelProviders(map: Record<string, ProviderId>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("aiui-providers-changed"));
  } catch { /* noop */ }
}

/** The backends this model can route to, in menu order. */
export function getProviderChoices(modelId: string): ProviderId[] {
  const cfg = IMAGE_MODELS.find((m) => m.id === modelId);
  const declared = (cfg?.providerChoices ?? []) as ProviderId[];
  return PROVIDERS.map((p) => p.id).filter((id) => declared.includes(id));
}

/**
 * The backend a model should use. An explicit saved choice wins; a model with
 * exactly one option always routes there; everything else defaults to Kie.ai.
 */
export function getModelProvider(modelId: string): ProviderId {
  const saved = loadModelProviders()[modelId];
  if (saved) return saved;
  const choices = getProviderChoices(modelId);
  return choices.length === 1 ? choices[0] : "kie";
}

/** Persists the backend for a single model, leaving the others untouched. */
export function setModelProvider(modelId: string, provider: ProviderId) {
  const map = loadModelProviders();
  saveModelProviders({ ...map, [modelId]: provider });
}

/**
 * Models with more than one backend to choose from. Azure and Codex are image-only,
 * and Azure additionally needs a per-model deployment configured.
 */
export function modelHasProviderChoice(modelId: string): boolean {
  return getProviderChoices(modelId).length > 1;
}
