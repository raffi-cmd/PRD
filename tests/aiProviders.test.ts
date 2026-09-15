import { describe, it, expect } from 'vitest';
import { getAIProvider, computeLineDiff } from '../src/services/ai/provider';
import { POPULAR_AI_MODELS, AI_PROVIDER_PRESETS, getModelsForProvider } from '../src/constants/aiModels';

describe('AI Providers & Model Presets', () => {
  it('should return correct provider instance for all provider types', () => {
    const gemini = getAIProvider({ provider: 'gemini', apiKey: 'test', model: 'gemini-2.0-flash' });
    expect(gemini.name).toBe('Gemini');

    const openai = getAIProvider({ provider: 'openai', apiKey: 'test', model: 'gpt-4o-mini' });
    expect(openai.name).toBe('OpenAI');

    const anthropic = getAIProvider({ provider: 'anthropic', apiKey: 'test', model: 'claude-3-5-sonnet-latest' });
    expect(anthropic.name).toBe('Anthropic');

    const openrouter = getAIProvider({ provider: 'openrouter', apiKey: 'test', model: 'deepseek/deepseek-chat' });
    expect(openrouter.name).toBe('OpenRouter / Custom');

    const custom = getAIProvider({ provider: 'custom', apiKey: 'test', model: 'custom-model' });
    expect(custom.name).toBe('OpenRouter / Custom');
  });

  it('should have provider presets defined with default models and key URLs', () => {
    expect(AI_PROVIDER_PRESETS.gemini.defaultModel).toBe('gemini-2.0-flash');
    expect(AI_PROVIDER_PRESETS.openai.defaultModel).toBe('gpt-4o-mini');
    expect(AI_PROVIDER_PRESETS.anthropic.defaultModel).toBe('claude-3-5-sonnet-latest');
    expect(AI_PROVIDER_PRESETS.openrouter.defaultModel).toBe('deepseek/deepseek-chat');
  });

  it('should filter models correctly by provider', () => {
    const geminiModels = getModelsForProvider('gemini');
    expect(geminiModels.length).toBeGreaterThan(3);
    expect(geminiModels.some(m => m.id === 'gemini-2.0-flash')).toBe(true);
    expect(geminiModels.some(m => m.id === 'gemini-2.5-flash')).toBe(true);

    const openAIModels = getModelsForProvider('openai');
    expect(openAIModels.some(m => m.id === 'gpt-4o')).toBe(true);
    expect(openAIModels.some(m => m.id === 'gpt-4o-mini')).toBe(true);
    expect(openAIModels.some(m => m.id === 'o3-mini')).toBe(true);

    const claudeModels = getModelsForProvider('anthropic');
    expect(claudeModels.some(m => m.id === 'claude-3-7-sonnet-20250219')).toBe(true);
    expect(claudeModels.some(m => m.id === 'claude-3-5-sonnet-latest')).toBe(true);
  });

  it('should compute diff lines accurately', () => {
    const oldContent = 'Line 1\nLine 2';
    const newContent = 'Line 1\nLine 2 modified\nLine 3';
    const diff = computeLineDiff(oldContent, newContent);
    expect(diff.length).toBe(4);
    expect(diff[0].type).toBe('unchanged');
    expect(diff[1].type).toBe('removed');
    expect(diff[2].type).toBe('added');
    expect(diff[3].type).toBe('added');
  });
});
