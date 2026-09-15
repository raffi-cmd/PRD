import { AIProvider, AIProviderConfig, DiffLine } from '../../types/ai';
import { geminiProvider } from './gemini';
import { openAIProvider } from './openai';
import { anthropicProvider } from './anthropic';
import { customProvider } from './custom';

export function getAIProvider(config: AIProviderConfig): AIProvider {
  switch (config.provider) {
    case 'openai':
      return openAIProvider;
    case 'anthropic':
      return anthropicProvider;
    case 'openrouter':
    case 'custom':
      return customProvider;
    case 'gemini':
    default:
      return geminiProvider;
  }
}

export function computeLineDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result: DiffLine[] = [];

  const maxLen = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined) {
      result.push({ type: 'added', text: newLine });
    } else if (newLine === undefined) {
      result.push({ type: 'removed', text: oldLine });
    } else if (oldLine === newLine) {
      result.push({ type: 'unchanged', text: newLine });
    } else {
      result.push({ type: 'removed', text: oldLine });
      result.push({ type: 'added', text: newLine });
    }
  }

  return result;
}
