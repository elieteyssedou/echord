// Audio synthesis using Tone.js

import * as Tone from 'tone';
import { Note } from './chords';

class AudioSynthesizer {
  private synth: Tone.PolySynth | null = null;
  private isInitialized = false;
  private activeNotes: Map<number, string[]> = new Map();

  async initialize() {
    if (this.isInitialized) return;

    await Tone.start();
    console.log('Tone.js started');

    // Create a single persistent polyphonic synth
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sawtooth'
      },
      envelope: {
        attack: 0.02,
        decay: 0,
        sustain: 1,
        release: 0.3
      },
      volume: -5,
      maxPolyphony: 32
    }).toDestination();

    this.isInitialized = true;
    console.log('Synth initialized');
  }

  async playChord(notes: Note[], key: number) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.synth) {
      console.error('Synth not initialized');
      return;
    }

    // Stop any existing chord on this key first
    this.stopChord(key);

    // Convert note objects to Tone.js format
    const noteNames = notes.map(note => note.name + note.octave);
    console.log('Playing chord:', noteNames);

    // Store the active notes for this key
    this.activeNotes.set(key, noteNames);

    // Trigger attack - will sustain indefinitely
    this.synth.triggerAttack(noteNames, Tone.now());
  }

  stopChord(key: number) {
    if (!this.synth) return;

    const noteNames = this.activeNotes.get(key);
    if (!noteNames) return;

    console.log('Releasing chord:', noteNames);

    // Release only the notes for this specific key
    this.synth.triggerRelease(noteNames, Tone.now());

    this.activeNotes.delete(key);
  }

  stopAll() {
    if (!this.synth) return;

    // Release all active notes
    this.activeNotes.forEach((noteNames) => {
      this.synth!.triggerRelease(noteNames, Tone.now());
    });

    this.activeNotes.clear();
  }

  resume() {
    // Tone.js handles this automatically
  }

  cleanup() {
    this.stopAll();

    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }

    this.isInitialized = false;
  }
}

// Singleton instance
let synthInstance: AudioSynthesizer | null = null;

export const getSynthesizer = (): AudioSynthesizer => {
  if (!synthInstance) {
    synthInstance = new AudioSynthesizer();
  }
  return synthInstance;
};
