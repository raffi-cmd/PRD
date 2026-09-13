export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  baseUrl?: string;
  temperature?: number;
}

export interface AIContextSnippet {
  nodeId: string;
  nodeType: string;
  title: string;
  content: string;
  relationship: 'parent' | 'dependency' | 'related';
}

export interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  contextSnippets?: AIContextSnippet[];
  model?: string;
  temperature?: number;
}

export interface AIResponse {
  text: string;
  raw?: unknown;
  modelUsed: string;
  tokensUsed?: number;
}

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export interface AIProposal {
  nodeId: string;
  originalTitle: string;
  originalContent: string;
  proposedTitle: string;
  proposedContent: string;
  diffLines: DiffLine[];
  summary: string;
}

export interface AIProvider {
  name: string;
  generate(options: GenerateOptions, config: AIProviderConfig): Promise<AIResponse>;
}
