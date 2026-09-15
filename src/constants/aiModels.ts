import { AIModelPreset, AIProviderType } from '../types/ai';

export const AI_PROVIDER_PRESETS: Record<
  AIProviderType,
  {
    name: string;
    description: string;
    defaultModel: string;
    apiKeyUrl: string;
    keyPlaceholder: string;
    requiresBaseUrl?: boolean;
    defaultBaseUrl?: string;
  }
> = {
  gemini: {
    name: 'Google Gemini',
    description: 'Gemini 2.0 / 2.5 series with ultra-fast inference and 1M+ context window',
    defaultModel: 'gemini-2.0-flash',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIzaSy...'
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    description: 'GPT-4o, GPT-4o-mini, o1, and o3-mini models from OpenAI',
    defaultModel: 'gpt-4o-mini',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    keyPlaceholder: 'sk-proj-...'
  },
  anthropic: {
    name: 'Anthropic (Claude)',
    description: 'Claude 3.7 Sonnet, Claude 3.5 Sonnet, and Claude 3.5 Haiku',
    defaultModel: 'claude-3-5-sonnet-latest',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'sk-ant-api03-...'
  },
  openrouter: {
    name: 'OpenRouter',
    description: 'Unified gateway to 100+ AI models including DeepSeek, Llama 3, Claude, and GPT-4',
    defaultModel: 'deepseek/deepseek-chat',
    apiKeyUrl: 'https://openrouter.ai/keys',
    keyPlaceholder: 'sk-or-v1-...',
    defaultBaseUrl: 'https://openrouter.ai/api/v1'
  },
  custom: {
    name: 'Custom / Local (Ollama/LMStudio/Groq)',
    description: 'Any OpenAI-compatible API endpoint (Ollama, LM Studio, vLLM, DeepSeek, Groq)',
    defaultModel: 'llama3.2',
    apiKeyUrl: '',
    keyPlaceholder: 'gsk_... or custom key',
    requiresBaseUrl: true,
    defaultBaseUrl: 'http://localhost:11434/v1'
  }
};

export const POPULAR_AI_MODELS: AIModelPreset[] = [
  // --- Google Gemini ---
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    category: 'fast',
    description: 'Ultra fast, responsive, multimodal, and reliable for standard planning',
    isRecommended: true
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    category: 'fast',
    description: 'Next-generation adaptive flash model with high instruction adherence'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    category: 'reasoning',
    description: 'Deep reasoning for complex full-stack architectural synthesis'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    category: 'fast',
    description: 'Stable, proven fast model with high concurrency tolerance'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    category: 'reasoning',
    description: 'Large context reasoning model for heavy multi-file context'
  },
  {
    id: 'gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro Experimental',
    provider: 'gemini',
    category: 'flagship',
    description: 'Experimental flagship with state-of-the-art coding abilities'
  },

  // --- OpenAI / ChatGPT ---
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    category: 'flagship',
    description: 'Flagship versatile high-intelligence model for comprehensive specs',
    isRecommended: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    category: 'fast',
    description: 'Fast, highly cost-effective, ideal for quick iterations and node refinements',
    isRecommended: true
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    provider: 'openai',
    category: 'reasoning',
    description: 'High-speed reasoning model tailored for math, logic, and coding'
  },
  {
    id: 'o1',
    name: 'o1',
    provider: 'openai',
    category: 'reasoning',
    description: 'Advanced deep chain-of-thought reasoning for hard architecture problems'
  },
  {
    id: 'o1-mini',
    name: 'o1-mini',
    provider: 'openai',
    category: 'reasoning',
    description: 'Faster reasoning model specialized for coding synthesis'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    category: 'flagship',
    description: 'Previous generation GPT-4 model with 128k context'
  },

  // --- Anthropic Claude ---
  {
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    category: 'flagship',
    description: 'Hybrid reasoning model with unprecedented code architecture nuance',
    isRecommended: true
  },
  {
    id: 'claude-3-5-sonnet-latest',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    category: 'flagship',
    description: 'Industry-leading benchmark in coding, planning, and technical clarity',
    isRecommended: true
  },
  {
    id: 'claude-3-5-haiku-latest',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    category: 'fast',
    description: 'Lightning fast and punchy for quick prompt actions'
  },
  {
    id: 'claude-3-opus-latest',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    category: 'reasoning',
    description: 'Deep writing and foundational architectural reasoning'
  },

  // --- OpenRouter & DeepSeek / Open Models ---
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3 (Chat)',
    provider: 'openrouter',
    category: 'flagship',
    description: 'Exceptional open-weights architecture model with top coding benchmarks',
    isRecommended: true
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'openrouter',
    category: 'reasoning',
    description: 'Open reasoning model with chain-of-thought architecture planning'
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'openrouter',
    category: 'flagship',
    description: 'Meta flagship open model for general engineering tasks'
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet (via OpenRouter)',
    provider: 'openrouter',
    category: 'flagship',
    description: 'Access Anthropic Claude models via your unified OpenRouter balance'
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o (via OpenRouter)',
    provider: 'openrouter',
    category: 'flagship',
    description: 'Access OpenAI GPT-4o via your unified OpenRouter balance'
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash (via OpenRouter)',
    provider: 'openrouter',
    category: 'fast',
    description: 'Access Google Gemini models via OpenRouter'
  },
  {
    id: 'qwen/qwen-2.5-coder-32b-instruct',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'openrouter',
    category: 'fast',
    description: 'Specialized open coding model with high syntactical accuracy'
  }
];

export function getModelsForProvider(provider: AIProviderType): AIModelPreset[] {
  return POPULAR_AI_MODELS.filter((m) => m.provider === provider);
}
