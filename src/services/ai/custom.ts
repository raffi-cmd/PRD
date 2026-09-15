import { AIProvider, AIProviderConfig, GenerateOptions, AIResponse } from '../../types/ai';

export class CustomOpenAICompatibleProvider implements AIProvider {
  name = 'OpenRouter / Custom';

  async generate(options: GenerateOptions, config: AIProviderConfig): Promise<AIResponse> {
    const apiKey = config.apiKey?.trim();
    // Some local endpoints (like Ollama on localhost) do not require an API key
    const isLocalhost = config.baseUrl?.includes('localhost') || config.baseUrl?.includes('127.0.0.1');
    if (!apiKey && !isLocalhost) {
      throw new Error('API Key is missing for this provider. Please configure your key in Settings.');
    }

    const modelName = options.model || config.model || 'deepseek/deepseek-chat';
    const baseUrl = (
      config.baseUrl ||
      (config.provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'https://openrouter.ai/api/v1')
    ).replace(/\/+$/, '');

    const url = `${baseUrl}/chat/completions`;

    // Upstream context snippets if provided
    let userPrompt = options.prompt;
    if (options.contextSnippets && options.contextSnippets.length > 0) {
      const contextText = options.contextSnippets
        .map((snippet) => `--- [CONTEXT: ${snippet.nodeType.toUpperCase()} - "${snippet.title}"] ---\n${snippet.content}`)
        .join('\n\n');
      userPrompt = `${contextText}\n\n=== TASK ===\n${options.prompt}`;
    }

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

    if (options.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }

    messages.push({ role: 'user', content: userPrompt });

    const body: Record<string, unknown> = {
      model: modelName,
      messages,
      temperature: options.temperature ?? config.temperature ?? 0.4,
      max_tokens: config.maxTokens || 8192
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    // OpenRouter ranking headers
    if (baseUrl.includes('openrouter')) {
      headers['HTTP-Referer'] = 'https://raffi-cmd.github.io/PRD/';
      headers['X-Title'] = 'PRD Planner';
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Network error connecting to API (${url}): ${msg}`);
    }

    if (!response.ok) {
      let errDetail = '';
      try {
        const errorJson = await response.json();
        errDetail = errorJson?.error?.message || response.statusText;
      } catch {
        errDetail = response.statusText;
      }

      throw new Error(`Provider API error (${response.status}): ${errDetail}`);
    }

    const json = await response.json();
    const outputText = json.choices?.[0]?.message?.content;

    if (!outputText) {
      throw new Error('API returned an empty response. Please refine your prompt.');
    }

    return {
      text: outputText,
      raw: json,
      modelUsed: modelName,
      tokensUsed: json.usage?.total_tokens
    };
  }
}

export const customProvider = new CustomOpenAICompatibleProvider();
