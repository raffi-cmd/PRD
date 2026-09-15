import { AIProvider, AIProviderConfig, GenerateOptions, AIResponse } from '../../types/ai';

export class AnthropicProvider implements AIProvider {
  name = 'Anthropic';

  async generate(options: GenerateOptions, config: AIProviderConfig): Promise<AIResponse> {
    const apiKey = config.apiKey?.trim();
    if (!apiKey) {
      throw new Error('Anthropic Claude API Key is missing. Please configure your API key in Settings.');
    }

    const modelName = options.model || config.model || 'claude-3-5-sonnet-latest';
    const baseUrl = (config.baseUrl || 'https://api.anthropic.com/v1').replace(/\/+$/, '');
    const url = `${baseUrl}/messages`;

    // Upstream context snippets if provided
    let userPrompt = options.prompt;
    if (options.contextSnippets && options.contextSnippets.length > 0) {
      const contextText = options.contextSnippets
        .map((snippet) => `--- [CONTEXT: ${snippet.nodeType.toUpperCase()} - "${snippet.title}"] ---\n${snippet.content}`)
        .join('\n\n');
      userPrompt = `${contextText}\n\n=== TASK ===\n${options.prompt}`;
    }

    const body: Record<string, unknown> = {
      model: modelName,
      max_tokens: config.maxTokens || 8192,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: options.temperature ?? config.temperature ?? 0.4
    };

    if (options.systemInstruction) {
      body.system = options.systemInstruction;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(body)
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Network error connecting to Anthropic API: ${msg}`);
    }

    if (!response.ok) {
      let errDetail = '';
      try {
        const errorJson = await response.json();
        errDetail = errorJson?.error?.message || response.statusText;
      } catch {
        errDetail = response.statusText;
      }

      if (response.status === 401) {
        throw new Error('Invalid Anthropic API Key. Please verify your Claude key in Settings.');
      } else if (response.status === 429) {
        throw new Error(`Anthropic rate limit exceeded: ${errDetail}`);
      } else {
        throw new Error(`Anthropic API error (${response.status}): ${errDetail}`);
      }
    }

    const json = await response.json();
    // Anthropic returns content as array of blocks e.g. [{ type: 'text', text: '...' }]
    const textBlocks = Array.isArray(json.content)
      ? json.content
          .filter((block: any) => block.type === 'text')
          .map((block: any) => block.text)
          .join('\n')
      : '';

    if (!textBlocks) {
      throw new Error('Anthropic returned an empty response. Please refine your prompt.');
    }

    return {
      text: textBlocks,
      raw: json,
      modelUsed: modelName,
      tokensUsed: (json.usage?.input_tokens || 0) + (json.usage?.output_tokens || 0)
    };
  }
}

export const anthropicProvider = new AnthropicProvider();
