'use client';

import { CMajorChords } from '@/app/lib/chords';

interface KeyboardDisplayProps {
  activeKeys: Set<number>;
}

export default function KeyboardDisplay({ activeKeys }: KeyboardDisplayProps) {
  const keys = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="grid grid-cols-7 gap-3">
      {keys.map((key) => {
        const chord = CMajorChords[key];
        const isActive = activeKeys.has(key);

        return (
          <div
            key={key}
            className={`
              relative aspect-[3/4] rounded-xl border-2 transition-all duration-150
              ${
                isActive
                  ? 'bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/50 scale-95'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30'
              }
            `}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 space-y-2">
              {/* Key Number */}
              <div
                className={`
                  text-4xl font-bold font-mono
                  ${isActive ? 'text-white' : 'text-purple-400'}
                `}
              >
                {key}
              </div>

              {/* Chord Name */}
              <div
                className={`
                  text-xs font-medium text-center
                  ${isActive ? 'text-purple-100' : 'text-purple-300/60'}
                `}
              >
                {chord.name}
              </div>

              {/* Numeral */}
              <div
                className={`
                  text-xs font-mono
                  ${isActive ? 'text-purple-200' : 'text-purple-400/40'}
                `}
              >
                {chord.numeral}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
