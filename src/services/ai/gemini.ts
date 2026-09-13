import { AIProvider, AIProviderConfig, GenerateOptions, AIResponse } from '../../types/ai';

export class GeminiProvider implements AIProvider {
  name = 'Gemini';

  async generate(options: GenerateOptions, config: AIProviderConfig): Promise<AIResponse> {
    const apiKey = config.apiKey?.trim();
    if (!apiKey) {
      throw new Error('Gemini API Key is missing. Please configure your API key in Settings.');
    }

    const modelName = options.model || config.model || 'gemini-3.7-flash';
    const baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
    const url = `${baseUrl}/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

    // Upstream context snippets if provided
    let fullPrompt = options.prompt;
    if (options.contextSnippets && options.contextSnippets.length > 0) {
      const contextText = options.contextSnippets
        .map((snippet) => `--- [CONTEXT: ${snippet.nodeType.toUpperCase()} - "${snippet.title}"] ---\n${snippet.content}`)
        .join('\n\n');
      fullPrompt = `${contextText}\n\n=== TASK ===\n${options.prompt}`;
    }

    contents.push({
      parts: [{ text: fullPrompt }]
    });

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: options.temperature ?? config.temperature ?? 0.4,
        maxOutputTokens: 8192
      }
    };

    if (options.systemInstruction) {
      body.system_instruction = {
        parts: [{ text: options.systemInstruction }]
      };
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Network error connecting to Gemini API: ${msg}`);
    }

    if (!response.ok) {
      let errDetail = '';
      try {
        const errorJson = await response.json();
        errDetail = errorJson?.error?.message || response.statusText;
      } catch {
        errDetail = response.statusText;
      }

      if (response.status === 400 && errDetail.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API Key. Please verify your key in Settings.');
      } else if (response.status === 429) {
        throw new Error('Gemini API rate limit reached. Please wait a moment and try again.');
      } else {
        throw new Error(`Gemini API error (${response.status}): ${errDetail}`);
      }
    }

    const json = await response.json();
    const candidate = json.candidates?.[0];
    const outputText = candidate?.content?.parts?.[0]?.text;

    if (!outputText) {
      if (candidate?.finishReason === 'SAFETY') {
        throw new Error('Gemini blocked this request due to safety filters.');
      }
      throw new Error('Gemini returned an empty response. Please refine the prompt.');
    }

    return {
      text: outputText,
      raw: json,
      modelUsed: modelName,
      tokensUsed: json.usageMetadata?.totalTokenCount
    };
  }
}

export const geminiProvider = new GeminiProvider();
