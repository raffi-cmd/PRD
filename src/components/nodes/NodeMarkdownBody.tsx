import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { Edit3, Check, Eye } from 'lucide-react';

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
    <div className="p-3.5 text-sm">
      <div className="flex items-center justify-between mb-2 text-slate-400">
        <span className="text-[10px] font-mono tracking-wider uppercase">Content</span>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 transition cursor-pointer"
          title={isEditing ? 'Save edits' : 'Edit markdown'}
        >
          {isEditing ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Done</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3 h-3 text-slate-400" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleSave();
              }
            }}
            rows={8}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-md p-2.5 text-slate-200 font-mono text-xs focus:border-brand-500 focus:outline-none resize-y nodrag nowheel"
            placeholder="Write markdown here..."
          />
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Markdown supported</span>
            <button
              onClick={handleSave}
              className="bg-brand-500 hover:bg-brand-400 text-slate-950 px-2.5 py-1 rounded font-medium transition cursor-pointer"
            >
              Save Content
            </button>
          </div>
        </div>
      ) : (
        <div
          onDoubleClick={() => setIsEditing(true)}
          className="prose-node max-h-[320px] overflow-y-auto text-slate-300 leading-relaxed pr-1 cursor-text"
          dangerouslySetInnerHTML={{ __html: parsedHtml }}
          title="Double click to edit"
        />
      )}
    </div>
  );
};
