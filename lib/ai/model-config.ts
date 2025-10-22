/**
 * Model Configuration
 *
 * Centralized model configuration supporting multiple LLM providers
 */

export interface ModelConfig {
  provider: 'openai' | 'gemini' | 'anthropic';
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export const AVAILABLE_MODELS = {
  // OpenAI Models
  'gpt-4o': {
    provider: 'openai' as const,
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    maxTokens: 4096,
  },
  'gpt-4o-mini': {
    provider: 'openai' as const,
    model: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    maxTokens: 4096,
  },
  'gpt-3.5-turbo': {
    provider: 'openai' as const,
    model: 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    maxTokens: 4096,
  },

  // Gemini Models
  'gemini-2.0-flash-exp': {
    provider: 'gemini' as const,
    model: 'gemini-2.0-flash-exp',
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
    maxTokens: 8192,
  },
  'gemini-2.5-flash': {
    provider: 'gemini' as const,
    model: 'gemini-2.5-flash',
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
    maxTokens: 8192,
  },
  'gemini-pro': {
    provider: 'gemini' as const,
    model: 'gemini-pro',
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
    maxTokens: 8192,
  },

  // Anthropic Models
  'claude-3-5-sonnet': {
    provider: 'anthropic' as const,
    model: 'claude-3-5-sonnet-20241022',
    apiKey: process.env.ANTHROPIC_API_KEY,
    temperature: 0.7,
    maxTokens: 4096,
  },
  'claude-3-5-haiku': {
    provider: 'anthropic' as const,
    model: 'claude-3-5-haiku-20241022',
    apiKey: process.env.ANTHROPIC_API_KEY,
    temperature: 0.7,
    maxTokens: 4096,
  },
} as const;

export type ModelName = keyof typeof AVAILABLE_MODELS;

/**
 * Get model configuration by name
 * Falls back to default model if not found or API key missing
 */
export function getModelConfig(selectedModel?: string): ModelConfig {
  const defaultModel = (process.env.DEFAULT_MODEL || 'gpt-4o') as ModelName;

  // If no model selected, use default
  if (!selectedModel) {
    return AVAILABLE_MODELS[defaultModel];
  }

  // Check if model exists in config
  const modelConfig = AVAILABLE_MODELS[selectedModel as ModelName];

  // If model not found or API key missing, fall back to default
  if (!modelConfig || !modelConfig.apiKey) {
    console.warn(`[Model Config] Model "${selectedModel}" not available, using default: ${defaultModel}`);
    return AVAILABLE_MODELS[defaultModel];
  }

  return modelConfig;
}

/**
 * Get list of available models (those with API keys configured)
 */
export function getAvailableModels(): ModelName[] {
  return Object.entries(AVAILABLE_MODELS)
    .filter(([_, config]) => config.apiKey)
    .map(([name]) => name as ModelName);
}

/**
 * Validate if a model is available
 */
export function isModelAvailable(modelName: string): boolean {
  const config = AVAILABLE_MODELS[modelName as ModelName];
  return !!(config && config.apiKey);
}
