import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, Check, Zap, Brain, Layers, Search, X, PlusCircle } from 'lucide-react';
import { AIModelPreset, AIProviderType } from '../../types/ai';
import { POPULAR_AI_MODELS } from '../../constants/aiModels';

interface ModelAutocompleteProps {
  value: string;
  onChange: (modelId: string) => void;
  provider: AIProviderType;
  placeholder?: string;
  disabled?: boolean;
}

export const ModelAutocomplete: React.FC<ModelAutocompleteProps> = ({
  value,
  onChange,
  provider,
  placeholder = 'Type or search model...',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize internal query state with external value changes
  useEffect(() => {
    setSearchQuery(value || '');
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter models for the current provider, or all if query matches across
  const providerModels = POPULAR_AI_MODELS.filter((m) => m.provider === provider);
  const filteredModels = providerModels.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.id.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q))
    );
  });

  const exactMatch = providerModels.some(
    (m) => m.id.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setSearchQuery(nextVal);
    onChange(nextVal);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredModels.length > 0 && !exactMatch && searchQuery.trim().length > 0) {
        // If user pressed enter on filtered list, select first match or current query
        const best = filteredModels[0];
        setSearchQuery(best.id);
        onChange(best.id);
      } else {
        onChange(searchQuery.trim());
      }
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectModel = (model: AIModelPreset) => {
    setSearchQuery(model.id);
    onChange(model.id);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSelectCustomQuery = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      onChange(trimmed);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'fast':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-2.5 h-2.5" /> FAST
          </span>
        );
      case 'reasoning':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Brain className="w-2.5 h-2.5" /> REASONING
          </span>
        );
      case 'flagship':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-2.5 h-2.5" /> FLAGSHIP
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-lg pl-3 pr-16 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none font-mono transition shadow-inner"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onChange('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer transition"
              title="Clear input"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer transition"
            title="Toggle suggestions"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-800/50 backdrop-blur-md">
          {/* Quick info bar */}
          <div className="px-3 py-1.5 bg-slate-950/80 text-[10px] text-slate-400 flex items-center justify-between border-b border-slate-800/80">
            <span className="flex items-center gap-1">
              <Search className="w-3 h-3 text-brand-400" />
              {filteredModels.length} suggestions
            </span>
            <span className="font-mono text-slate-500">Press Enter or click</span>
          </div>

          {/* If user typed custom query not exact match, show option to use it */}
          {searchQuery.trim() && !exactMatch && (
            <button
              type="button"
              onClick={handleSelectCustomQuery}
              className="w-full text-left px-3 py-2 text-xs bg-brand-500/5 hover:bg-brand-500/15 border-b border-slate-800/60 flex items-center justify-between transition cursor-pointer text-brand-300"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <PlusCircle className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="truncate">Use model: <code className="font-mono font-bold text-slate-100">{searchQuery.trim()}</code></span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono shrink-0">CUSTOM</span>
            </button>
          )}

          {filteredModels.length > 0 ? (
            <div className="py-1">
              {filteredModels.map((m) => {
                const isSelected = value === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectModel(m)}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-brand-500/10 text-brand-300 border-l-2 border-brand-500'
                        : 'hover:bg-slate-800/70 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono font-medium truncate text-[11px] text-slate-100">
                          {m.id}
                        </span>
                        {m.isRecommended && (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8px] font-semibold bg-brand-500/20 text-brand-300">
                            <Sparkles className="w-2 h-2" /> REC
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {getCategoryBadge(m.category)}
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-400" />}
                      </div>
                    </div>
                    {m.description && (
                      <p className="text-[10px] text-slate-400 line-clamp-1">{m.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-slate-400">
              <p className="text-[11px] text-slate-300 font-mono mb-1">"{searchQuery}"</p>
              <p className="text-[10px] text-slate-500">
                Custom model will be passed directly to the API endpoint.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
