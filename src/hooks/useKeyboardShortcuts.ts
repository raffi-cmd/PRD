import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenCommandPalette?: () => void;
  onDeleteSelected?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onUndo,
  onRedo,
  onOpenCommandPalette,
  onDeleteSelected,
  onEscape
}: KeyboardShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept shortcuts when typing in inputs/textareas unless it's Ctrl+K or Escape
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenCommandPalette?.();
        return;
      }

      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (isInput) return;

      // Ctrl + S / Cmd + S
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Ctrl + Z / Cmd + Z (Undo / Redo)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo?.();
        } else {
          onUndo?.();
        }
        return;
      }

      // Ctrl + Y (Redo on Windows)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        onRedo?.();
        return;
      }

      // Delete or Backspace
      if (e.key === 'Delete') {
        onDeleteSelected?.();
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onUndo, onRedo, onOpenCommandPalette, onDeleteSelected, onEscape]);
}
