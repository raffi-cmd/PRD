import { AIProvider, AIProviderConfig, GenerateOptions, AIResponse } from '../../types/ai';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';

  async generate(options: GenerateOptions, config: AIProviderConfig): Promise<AIResponse> {
    const apiKey = config.apiKey?.trim();
    if (!apiKey) {
      throw new Error('OpenAI API Key is missing. Please configure your API key in Settings.');
    }

    const modelName = options.model || config.model || 'gpt-4o-mini';
    const baseUrl = (config.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
    const url = `${baseUrl}/chat/completions`;

    // Upstream context snippets if provided
    let userPrompt = options.prompt;
    if (options.contextSnippets && options.contextSnippets.length > 0) {
      const contextText = options.contextSnippets
        .map((snippet) => `--- [CONTEXT: ${snippet.nodeType.toUpperCase()} - "${snippet.title}"] ---\n${snippet.content}`)
        .join('\n\n');
      userPrompt = `${contextText}\n\n=== TASK ===\n${options.prompt}`;
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant' | 'developer'; content: string }> = [];

    const isReasoningModel = modelName.startsWith('o1') || modelName.startsWith('o3');

    if (options.systemInstruction) {
      if (isReasoningModel) {
        messages.push({ role: 'developer', content: options.systemInstruction });
      } else {
        messages.push({ role: 'system', content: options.systemInstruction });
      }
    }

    messages.push({ role: 'user', content: userPrompt });

    const body: Record<string, unknown> = {
      model: modelName,
      messages
    };

    if (isReasoningModel) {
      body.max_completion_tokens = config.maxTokens || 8192;
      // Reasoning models (o1/o3) do not accept custom temperature parameter
    } else {
      body.temperature = options.temperature ?? config.temperature ?? 0.4;
      body.max_tokens = config.maxTokens || 8192;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Network error connecting to OpenAI API: ${msg}`);
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
        throw new Error('Invalid OpenAI API Key. Please verify your OpenAI key in Settings.');
      } else if (response.status === 429) {
        throw new Error(`OpenAI quota or rate limit reached: ${errDetail}`);
      } else {
        throw new Error(`OpenAI API error (${response.status}): ${errDetail}`);
      }
    }

    const json = await response.json();
    const outputText = json.choices?.[0]?.message?.content;

    if (!outputText) {
      throw new Error('OpenAI returned an empty response. Please refine your prompt.');
    }

    return {
      text: outputText,
      raw: json,
      modelUsed: modelName,
      tokensUsed: json.usage?.total_tokens
    };
  }
}

export const openAIProvider = new OpenAIProvider();
