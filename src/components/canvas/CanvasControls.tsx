import React from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, LayoutGrid } from 'lucide-react';

interface CanvasControlsProps {
  onAutoLayout?: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({ onAutoLayout }) => {
  const { zoomIn, zoomOut, setViewport, fitView, getViewport } = useReactFlow();
  const { zoom } = useViewport();

  const handleResetZoom = () => {
    const vp = getViewport();
    setViewport({ x: vp.x, y: vp.y, zoom: 1 }, { duration: 300 });
  };

  const handleFitView = () => {
    fitView({ padding: 0.25, duration: 400 });
  };

  const currentPercent = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-6 left-6 z-40 flex items-center gap-1 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl p-1.5 backdrop-blur-md">
      {/* Zoom Out */}
      <button
        onClick={() => zoomOut({ duration: 300 })}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
        title="Zoom Out (-)"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Zoom percentage button (click to reset to 100%) */}
      <button
        onClick={handleResetZoom}
        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-brand-400 font-mono text-xs font-semibold transition cursor-pointer min-w-[54px] text-center"
        title="Click to reset zoom to 100%"
      >
        {currentPercent}%
      </button>

      {/* Zoom In */}
      <button
        onClick={() => zoomIn({ duration: 300 })}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
        title="Zoom In (+)"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-slate-800 mx-1" />

      {/* Fit View */}
      <button
        onClick={handleFitView}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
        title="Fit All Nodes in View"
      >
        <Maximize className="w-4 h-4" />
      </button>

      {/* Auto Arrange Layout */}
      {onAutoLayout && (
        <button
          onClick={onAutoLayout}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-brand-400 transition cursor-pointer"
          title="Auto-Arrange Layout"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
