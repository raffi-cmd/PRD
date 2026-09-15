import React, { useState, useEffect } from 'react';
import { AIProviderConfig, AIProviderType } from '../../types/ai';
import {
  X,
  Eye,
  EyeOff,
  Key,
  ShieldCheck,
  Check,
  Cpu,
  Sparkles,
  ExternalLink,
  Activity,
  AlertCircle,
  Loader2,
  Server
} from 'lucide-react';
import { AI_PROVIDER_PRESETS } from '../../constants/aiModels';
import { ModelAutocomplete } from '../common/ModelAutocomplete';
import { getStoredApiKey, setStoredApiKey } from '../../services/storage/projectIO';
import { getAIProvider } from '../../services/ai/provider';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIProviderConfig;
  onSaveConfig: (newConfig: AIProviderConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [activeProvider, setActiveProvider] = useState<AIProviderType>(config.provider || 'gemini');
  const [apiKey, setApiKey] = useState(config.apiKey || getStoredApiKey(config.provider || 'gemini'));
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(config.model || 'gemini-2.0-flash');
  const [baseUrl, setBaseUrl] = useState(config.baseUrl || '');
  const [temperature, setTemperature] = useState(config.temperature ?? 0.4);
  const [maxTokens, setMaxTokens] = useState(config.maxTokens ?? 8192);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string; latency?: number } | null>(null);

  // When switching provider, load the stored key for that provider and default model if not set
  const handleSwitchProvider = (newProvider: AIProviderType) => {
    setActiveProvider(newProvider);
    const stored = getStoredApiKey(newProvider);
    setApiKey(stored);
    const preset = AI_PROVIDER_PRESETS[newProvider];
    setModel(preset.defaultModel);
    if (preset.defaultBaseUrl) {
      setBaseUrl(preset.defaultBaseUrl);
    } else {
      setBaseUrl('');
    }
    setTestResult(null);
  };

  useEffect(() => {
    if (isOpen) {
      const currentProv = config.provider || 'gemini';
      setActiveProvider(currentProv);
      setApiKey(config.apiKey || getStoredApiKey(currentProv));
      setModel(config.model || AI_PROVIDER_PRESETS[currentProv].defaultModel);
      setBaseUrl(config.baseUrl || AI_PROVIDER_PRESETS[currentProv].defaultBaseUrl || '');
      setTemperature(config.temperature ?? 0.4);
      setMaxTokens(config.maxTokens ?? 8192);
      setTestResult(null);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const currentPreset = AI_PROVIDER_PRESETS[activeProvider];

  const handleTestConnection = async () => {
    const trimmedKey = apiKey.trim();
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
    if (!trimmedKey && !isLocalhost && activeProvider !== 'custom') {
      setTestResult({
        ok: false,
        message: 'Please enter an API key first.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const startTime = performance.now();

    try {
      const testConfig: AIProviderConfig = {
        provider: activeProvider,
        apiKey: trimmedKey,
        model: model.trim() || currentPreset.defaultModel,
        baseUrl: baseUrl.trim() || undefined,
        temperature: 0.2,
        maxTokens: 50
      };

      const providerInstance = getAIProvider(testConfig);
      const res = await providerInstance.generate(
        {
          prompt: 'Respond strictly with the word "OK" to confirm API connectivity.',
          temperature: 0.1
        },
        testConfig
      );

      const latency = Math.round(performance.now() - startTime);
      setTestResult({
        ok: true,
        message: `Success! Connected to ${testConfig.model} (${res.text.trim().substring(0, 20)})`,
        latency
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        ok: false,
        message: msg
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    setStoredApiKey(activeProvider, trimmedKey);
    localStorage.setItem('vibe_ai_provider', activeProvider);
    localStorage.setItem(`vibe_${activeProvider}_model`, model.trim());

    const updated: AIProviderConfig = {
      provider: activeProvider,
      apiKey: trimmedKey,
      model: model.trim() || currentPreset.defaultModel,
      baseUrl: baseUrl.trim() || undefined,
      temperature,
      maxTokens
    };

    onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const providersList: AIProviderType[] = ['gemini', 'openai', 'anthropic', 'openrouter', 'custom'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">AI Model & Provider Settings</h2>
              <p className="text-[11px] text-slate-400">Configure Gemini, ChatGPT, Claude, or OpenRouter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* Provider Selector Tabs */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">AI Provider</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {providersList.map((p) => {
                const isSelected = activeProvider === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSwitchProvider(p)}
                    className={`py-1.5 px-2 rounded text-[11px] font-medium transition cursor-pointer text-center capitalize truncate ${
                      isSelected
                        ? 'bg-brand-500 text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {p === 'openai' ? 'ChatGPT' : p === 'anthropic' ? 'Claude' : p}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">{currentPreset.description}</p>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-slate-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-brand-400" />
                <span>{currentPreset.name} API Key</span>
              </label>
              {currentPreset.apiKeyUrl && (
                <a
                  href={currentPreset.apiKeyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-400 hover:underline text-[10px] flex items-center gap-0.5"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder={currentPreset.keyPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Keys are stored securely in your browser's local storage and never sent to any third-party server.
            </p>
          </div>

          {/* Model Autocomplete & Custom Typeable Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Model Name / ID</span>
              </label>
              <span className="text-[10px] text-slate-400">Type freely or select from suggestions</span>
            </div>
            <ModelAutocomplete
              value={model}
              onChange={(newModel) => {
                setModel(newModel);
                setTestResult(null);
              }}
              provider={activeProvider}
              placeholder={`e.g. ${currentPreset.defaultModel}`}
            />
          </div>

          {/* Base URL (Optional / Custom) */}
          {(currentPreset.requiresBaseUrl || activeProvider === 'openrouter' || activeProvider === 'custom') && (
            <div>
              <label className="block font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span>Base URL Endpoint</span>
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => {
                  setBaseUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder={currentPreset.defaultBaseUrl || 'https://api.openai.com/v1'}
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                For local Ollama use <code className="text-slate-400">http://localhost:11434/v1</code>, for DeepSeek use <code className="text-slate-400">https://api.deepseek.com/v1</code>
              </p>
            </div>
          )}

          {/* Temperature Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-slate-300">Creativity / Temperature</label>
              <span className="font-mono text-slate-400">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0.0 (Precise / Code Specs)</span>
              <span>1.0 (Creative / Brainstorming)</span>
            </div>
          </div>

          {/* Test Connection Button & Status */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
                  <span>Testing API Connection...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 text-brand-400" />
                  <span>Test API & Model Connection</span>
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`mt-2 p-2.5 rounded-lg border text-[11px] flex items-start gap-2 ${
                  testResult.ok
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                }`}
              >
                {testResult.ok ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{testResult.message}</p>
                  {testResult.latency !== undefined && (
                    <p className="text-[10px] text-emerald-400/80 mt-0.5">Latency: {testResult.latency}ms</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local client storage</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
