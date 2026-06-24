import { useState, useRef } from 'react';
import { Calendar, Edit2 } from 'lucide-react';
import { EditableText } from './EditableText';
import { useFirebaseSync } from '../hooks/useFirebaseSync';

export function ProgressTracker() {
  const [progress, setProgress] = useFirebaseSync("projectProgress", 25);
  const [isDragging, setIsDragging] = useState(false);
  const [targetDate, setTargetDate] = useFirebaseSync("targetDate", '16th June');
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const calculateProgress = (clientX: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const buttonWidth = 32; // w-8 = 32px
    const buttonRadius = buttonWidth / 2;

    // Adjust for button radius so 0% and 100% are reachable
    const adjustedWidth = rect.width - buttonWidth;
    const x = clientX - rect.left - buttonRadius;
    const percentage = Math.max(0, Math.min(100, (x / adjustedWidth) * 100));
    setProgress(Math.round(percentage));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    calculateProgress(e.clientX);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateProgress(e.clientX);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
          <p className="text-sm text-gray-600 mt-1">
            {progress}% complete • {100 - progress}% remaining
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Target:</span>
            <EditableText
              value={targetDate}
              onChange={setTargetDate}
              className="text-sm font-medium text-gray-700"
              placeholder="Set target date..."
            />
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative h-12 bg-gray-200 rounded-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleTrackClick}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-blue-600 cursor-grab active:cursor-grabbing flex items-center justify-center transition-transform hover:scale-110"
          style={{ left: `calc(${progress}% - 16px)` }}
          onMouseDown={handleMouseDown}
        >
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-700">
            {progress < 50 ? '' : `${progress}% Complete`}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-gray-600">
        <div className="text-center">
          <div className="font-medium">0%</div>
          <div className="text-gray-400">Start</div>
        </div>
        <div className="text-center">
          <div className="font-medium">25%</div>
          <div className="text-gray-400">Strategy</div>
        </div>
        <div className="text-center">
          <div className="font-medium">50%</div>
          <div className="text-gray-400">Discovery</div>
        </div>
        <div className="text-center">
          <div className="font-medium">100%</div>
          <div className="text-gray-400">Delivery</div>
        </div>
      </div>
    </div>
  );
}
