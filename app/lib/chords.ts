// Chord definitions for C major scale using Nashville Number System

export interface Note {
  name: string;
  octave: number;
}

export interface Chord {
  numeral: string;
  name: string;
  quality: string;
  root: string;
  notes: Note[];
}

// C Major scale degrees
const scaleNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Build a triad chord from a root note
const buildTriad = (rootIndex: number, quality: 'major' | 'minor' | 'diminished'): Note[] => {
  const root = scaleNotes[rootIndex];

  // Intervals for different chord qualities (in scale degrees)
  let thirdInterval: number;
  let fifthInterval: number;

  if (quality === 'major') {
    thirdInterval = 2; // Major third
    fifthInterval = 4; // Perfect fifth
  } else if (quality === 'minor') {
    thirdInterval = 2; // Minor third
    fifthInterval = 4; // Perfect fifth
  } else { // diminished
    thirdInterval = 2; // Minor third
    fifthInterval = 4; // Diminished fifth
  }

  const thirdIndex = (rootIndex + thirdInterval) % 7;
  const fifthIndex = (rootIndex + fifthInterval) % 7;

  const third = scaleNotes[thirdIndex];
  const fifth = scaleNotes[fifthIndex];

  // Octave calculation - keep it tight in octave 3-4
  const rootOctave = 3;
  const thirdOctave = thirdIndex < rootIndex ? 4 : 3;
  const fifthOctave = fifthIndex < rootIndex ? 4 : 3;

  return [
    { name: root, octave: rootOctave },
    { name: third, octave: thirdOctave },
    { name: fifth, octave: fifthOctave }
  ];
};

// Diatonic chords in C major scale (I ii iii IV V vi vii°)
export const CMajorChords: Record<number, Chord> = {
  1: {
    numeral: 'I',
    name: 'C Major',
    quality: 'major',
    root: 'C',
    notes: buildTriad(0, 'major'),
  },
  2: {
    numeral: 'ii',
    name: 'D Minor',
    quality: 'minor',
    root: 'D',
    notes: buildTriad(1, 'minor'),
  },
  3: {
    numeral: 'iii',
    name: 'E Minor',
    quality: 'minor',
    root: 'E',
    notes: buildTriad(2, 'minor'),
  },
  4: {
    numeral: 'IV',
    name: 'F Major',
    quality: 'major',
    root: 'F',
    notes: buildTriad(3, 'major'),
  },
  5: {
    numeral: 'V',
    name: 'G Major',
    quality: 'major',
    root: 'G',
    notes: buildTriad(4, 'major'),
  },
  6: {
    numeral: 'vi',
    name: 'A Minor',
    quality: 'minor',
    root: 'A',
    notes: buildTriad(5, 'minor'),
  },
  7: {
    numeral: 'vii°',
    name: 'B Diminished',
    quality: 'diminished',
    root: 'B',
    notes: buildTriad(6, 'diminished'),
  },
};

export const getChordByKey = (key: number): Chord | null => {
  return CMajorChords[key] || null;
};
