import { AIProvider, AIProviderConfig, GenerateOptions, AIResponse } from '../../types/ai';

export class GeminiProvider implements AIProvider {
  name = 'Gemini';

  async generate(options: GenerateOptions, config: AIProviderConfig): Promise<AIResponse> {
    const apiKey = config.apiKey?.trim();
    if (!apiKey) {
      throw new Error('Gemini API Key is missing. Please configure your API key in Settings.');
    }

    // Default to ultra fast and reliable 2.0 flash
    let modelName = options.model || config.model || 'gemini-2.0-flash';
    // Clean model name if user typed with prefix
    if (modelName.startsWith('models/')) {
      modelName = modelName.replace('models/', '');
    }

    const baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';

    // Upstream context snippets if provided
    let fullPrompt = options.prompt;
    if (options.contextSnippets && options.contextSnippets.length > 0) {
      const contextText = options.contextSnippets
        .map((snippet) => `--- [CONTEXT: ${snippet.nodeType.toUpperCase()} - "${snippet.title}"] ---\n${snippet.content}`)
        .join('\n\n');
      fullPrompt = `${contextText}\n\n=== TASK ===\n${options.prompt}`;
    }

    const body: Record<string, unknown> = {
      contents: [
        {
          parts: [{ text: fullPrompt }]
        }
      ],
      generationConfig: {
        temperature: options.temperature ?? config.temperature ?? 0.4,
        maxOutputTokens: config.maxTokens || 8192
      }
    };

    if (options.systemInstruction) {
      body.system_instruction = {
        parts: [{ text: options.systemInstruction }]
      };
    }

    // Attempt request with retry & fallback on 503 / high demand
    const executeRequest = async (targetModel: string): Promise<Response> => {
      const url = `${baseUrl}/models/${targetModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
      return await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    };

    let response: Response;
    let usedModel = modelName;

    try {
      response = await executeRequest(usedModel);

      // If 503 (Overloaded/High Demand) or 404 (Model not found), try exponential retry or fallback model
      if (response.status === 503 || response.status === 404) {
        const fallbackCandidates = ['gemini-2.0-flash', 'gemini-1.5-flash'];
        for (const fbModel of fallbackCandidates) {
          if (fbModel !== usedModel) {
            // Brief backoff
            await new Promise((r) => setTimeout(r, 600));
            const retryRes = await executeRequest(fbModel);
            if (retryRes.ok) {
              response = retryRes;
              usedModel = fbModel;
              break;
            }
          }
        }
      }
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

      if (response.status === 400 && (errDetail.includes('API_KEY_INVALID') || errDetail.includes('API key not valid'))) {
        throw new Error('Invalid Gemini API Key. Please verify your key in Settings.');
      } else if (response.status === 429) {
        throw new Error('Gemini API rate limit or quota exceeded. Please wait a moment or switch to another model/provider.');
      } else if (response.status === 503) {
        throw new Error(
          `Gemini API is currently overloaded (503: High demand). Please retry or switch to "gemini-1.5-flash" or OpenAI/Claude in Settings.`
        );
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
      modelUsed: usedModel,
      tokensUsed: json.usageMetadata?.totalTokenCount
    };
  }
}

export const geminiProvider = new GeminiProvider();
