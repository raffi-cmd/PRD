import React, { useState } from 'react';
import { VisualReference } from '../../types/project';
import { Image as ImageIcon, Plus, Trash2, Tag, Check, X, Sparkles, BookOpen, Layers } from 'lucide-react';

interface VisualReferencesManagerProps {
  references: VisualReference[];
  onChange: (updated: VisualReference[]) => void;
}

export const VisualReferencesManager: React.FC<VisualReferencesManagerProps> = ({
  references,
  onChange
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newBorrow, setNewBorrow] = useState('');
  const [borrowList, setBorrowList] = useState<string[]>([]);
  const [newNotCopy, setNewNotCopy] = useState('');
  const [notCopyList, setNotCopyList] = useState<string[]>([]);

  const handleAddReference = () => {
    if (!title.trim()) return;
    const newRef: VisualReference = {
      id: `ref-${Date.now().toString(36)}`,
      title: title.trim(),
      imageUrl: imageUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      whatToBorrow: borrowList.length > 0 ? borrowList : ['Hierarchy & Spacing', 'Typography rhythm'],
      whatNotToCopy: notCopyList.length > 0 ? notCopyList : ['Branding & logos', 'Exact layout copy'],
      analysis: {
        layout: 'Structured modular grid',
        density: 'High information density',
        typography: 'Restrained sans + monospace accents',
        hierarchy: 'Prominent focal metric + compact secondary tools'
      }
    };

    onChange([...references, newRef]);
    setTitle('');
    setNotes('');
    setImageUrl('');
    setBorrowList([]);
    setNotCopyList([]);
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    onChange(references.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            Visual References & Inspiration
          </h3>
          <p className="text-[11px] text-slate-400">
            Define real-world references and explicitly distinguish <strong>What to Borrow</strong> (composition, hierarchy) vs <strong>What NOT to Copy</strong> (branding, exact layout).
          </p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reference</span>
          </button>
        )}
      </div>

      {/* Add Reference Form */}
      {isAdding && (
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> New Visual Reference
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-medium">Reference Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., "Linear.app issue board" or "Stripe terminal receipt"'
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-medium">Image URL / Screenshot Link (Optional)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-medium">Observations / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this reference is relevant (e.g. Crisp dark borders, high density data rows)..."
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Borrow vs Not Copy Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                ✓ What to Borrow (Principles)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {borrowList.map((item, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    {item}
                    <button type="button" onClick={() => setBorrowList(borrowList.filter((_, i) => i !== idx))} className="hover:text-rose-400">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g., Dense typography..."
                  value={newBorrow}
                  onChange={(e) => setNewBorrow(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newBorrow.trim()) {
                      setBorrowList([...borrowList, newBorrow.trim()]);
                      setNewBorrow('');
                    }
                  }}
                  className="flex-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newBorrow.trim()) {
                      setBorrowList([...borrowList, newBorrow.trim()]);
                      setNewBorrow('');
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                ✗ What NOT to Copy
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {notCopyList.map((item, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    {item}
                    <button type="button" onClick={() => setNotCopyList(notCopyList.filter((_, i) => i !== idx))} className="hover:text-rose-400">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g., Exact proprietary logo..."
                  value={newNotCopy}
                  onChange={(e) => setNewNotCopy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newNotCopy.trim()) {
                      setNotCopyList([...notCopyList, newNotCopy.trim()]);
                      setNewNotCopy('');
                    }
                  }}
                  className="flex-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newNotCopy.trim()) {
                      setNotCopyList([...notCopyList, newNotCopy.trim()]);
                      setNewNotCopy('');
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddReference}
              disabled={!title.trim()}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition disabled:opacity-40"
            >
              Save Reference
            </button>
          </div>
        </div>
      )}

      {/* Reference Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {references.map((ref) => (
          <div
            key={ref.id}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-800 text-brand-400 flex items-center justify-center shrink-0 text-xs font-mono">
                    #
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{ref.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(ref.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  title="Remove reference"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {ref.notes && (
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  "{ref.notes}"
                </p>
              )}

              {/* Borrow vs Not Copy Tags */}
              <div className="space-y-1.5 pt-1">
                {ref.whatToBorrow && ref.whatToBorrow.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                      Borrow Principles:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ref.whatToBorrow.map((b, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {ref.whatNotToCopy && ref.whatNotToCopy.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block mb-1">
                      Do NOT Copy:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ref.whatNotToCopy.map((nc, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          ✗ {nc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis observation footer */}
            {ref.analysis && (
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center gap-1 text-violet-300 font-semibold mb-0.5">
                  <Sparkles className="w-3 h-3" /> Structured Design Observation
                </div>
                <div><span className="text-slate-500">Layout:</span> {ref.analysis.layout}</div>
                <div><span className="text-slate-500">Typography:</span> {ref.analysis.typography}</div>
                <div><span className="text-slate-500">Density:</span> {ref.analysis.density}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
