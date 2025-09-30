'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getChordByKey } from '@/app/lib/chords';
import { getSynthesizer } from '@/app/lib/audio';
import KeyboardDisplay from './KeyboardDisplay';

export default function ChordSynth() {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [currentChord, setCurrentChord] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const pressedKeys = useRef<Set<string>>(new Set());

  // Initialize audio context on first interaction
  const initializeAudio = useCallback(async () => {
    if (!isInitialized) {
      const synth = getSynthesizer();
      await synth.initialize();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const playChord = useCallback(async (key: number) => {
    const chord = getChordByKey(key);
    if (!chord) return;

    await initializeAudio();

    const synth = getSynthesizer();
    await synth.playChord(chord.notes, key);

    setActiveKeys((prev) => new Set(prev).add(key));
    setCurrentChord(chord.name);
  }, [initializeAudio]);

  const stopChord = useCallback((key: number) => {
    const synth = getSynthesizer();
    synth.stopChord(key);

    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

    if (activeKeys.size <= 1) {
      setCurrentChord(null);
    }
  }, [activeKeys.size]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if already pressed (prevent key repeat)
      if (pressedKeys.current.has(e.key)) return;

      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 7) {
        e.preventDefault();
        pressedKeys.current.add(e.key);
        playChord(keyNum);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 7) {
        e.preventDefault();
        pressedKeys.current.delete(e.key);
        stopChord(keyNum);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playChord, stopChord]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      const synth = getSynthesizer();
      synth.cleanup();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-white tracking-tight">
            echord
          </h1>
          <p className="text-purple-300 text-sm uppercase tracking-wider">
            Key: C Major
          </p>
        </div>

        {/* Current Chord Display */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-8 text-center h-40 flex items-center justify-center">
          {currentChord ? (
            <div className="space-y-2">
              <p className="text-purple-400 text-sm uppercase tracking-wider">
                Now Playing
              </p>
              <p className="text-5xl font-bold text-white">
                {currentChord}
              </p>
            </div>
          ) : (
            <p className="text-purple-300/50 text-lg">
              Press 1-7 to play chords
            </p>
          )}
        </div>

        {/* Keyboard Display */}
        <KeyboardDisplay activeKeys={activeKeys} />

        {/* Instructions */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/10 p-6">
          <h3 className="text-purple-200 font-semibold mb-3 text-sm uppercase tracking-wider">
            How to Play
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-purple-300/80">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-mono font-bold text-purple-400">1</span>
                <span>C Major</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-purple-400">2</span>
                <span>D Minor</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-purple-400">3</span>
                <span>E Minor</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-purple-400">4</span>
                <span>F Major</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-mono font-bold text-purple-400">5</span>
                <span>G Major</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-purple-400">6</span>
                <span>A Minor</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-purple-400">7</span>
                <span>B Diminished</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
