import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { Edit3, Check } from 'lucide-react';

interface NodeMarkdownBodyProps {
  content: string;
  onSaveContent: (newContent: string) => void;
  isCollapsed?: boolean;
}

export const NodeMarkdownBody: React.FC<NodeMarkdownBodyProps> = ({
  content,
  onSaveContent,
  isCollapsed = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  if (isCollapsed) {
    return null;
  }

  const handleSave = () => {
    setIsEditing(false);
    if (draft !== content) {
      onSaveContent(draft);
    }
  };

  const parsedHtml = marked.parse(content || '*Empty content. Click edit to add details.*');

  return (
    <div className="p-4 text-sm">
      <div className="flex items-center justify-between mb-2 text-slate-400">
        <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
          Specification
        </span>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded hover:bg-slate-800 text-slate-200 transition cursor-pointer border border-transparent hover:border-slate-700"
          title={isEditing ? 'Save edits' : 'Edit markdown'}
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Done</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2.5">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleSave();
              }
            }}
            rows={10}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 font-mono text-xs focus:border-brand-500 focus:outline-none resize-y nodrag nowheel leading-relaxed"
            placeholder="Write markdown here..."
          />
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Markdown supported</span>
            <button
              onClick={handleSave}
              className="bg-brand-500 hover:bg-brand-400 text-slate-950 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer text-xs shadow-md shadow-brand-500/20"
            >
              Save Content
            </button>
          </div>
        </div>
      ) : (
        <div
          onDoubleClick={() => setIsEditing(true)}
          className="prose-node max-h-[340px] overflow-y-auto text-slate-200 leading-relaxed pr-1 cursor-text"
          dangerouslySetInnerHTML={{ __html: parsedHtml }}
          title="Double click to edit"
        />
      )}
    </div>
  );
};
