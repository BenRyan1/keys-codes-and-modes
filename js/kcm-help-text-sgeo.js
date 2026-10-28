/* KCM Help Mode text: Sacred Geometry music pages (S-Geo). DRAFT Oct 27 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'sgeo-draft-1',
  ids: {
    playBtn: { n: 'Play pattern', t: 'Plays the notes of the pattern you chose, one after another, while the shape lights up.' },
    stopBtn: { n: 'Stop', t: 'Stops the sound right now.' },
    keySelect: { n: 'Root key', t: 'Choose the home note. The pattern is built from it.' },
    rootNote: { n: 'Root note', t: 'Choose the home note. The pattern is built from it.' },
    playSpeed: { n: 'Play speed', t: 'Slide to change how fast the pattern plays.' },
    animSpeed: { n: 'Animation speed', t: 'Slide to change how fast the shapes move.' },
    volume: { n: 'Volume', t: 'Slide to change how loud the sound is.' },
    noteSeparation: { n: 'Note gap', t: 'Slide to change the pause between notes.' },
    harmonyMode: { n: 'Enhanced playback', t: 'Switch on to also play the outline notes, for a fuller sound.' },
    sequentialMode: { n: 'Auto-sequence', t: 'Switch on to play through every pattern in order, by itself.' },
    spacing: { n: 'Spacing', t: 'Slide to move the points closer together or farther apart.' },
    thickness: { n: 'Line thickness', t: 'Slide to make the lines thinner or thicker.' },
    lineWidth: { n: 'Line width', t: 'Slide to make the lines thinner or thicker.' },
    rotSpeed: { n: 'Rotation speed', t: 'Slide to change how fast the shape spins. Zero stops it.' },
    zoom: { n: 'Zoom', t: 'Slide to bring the shape closer or push it away.' },
    'btn-4fret': { n: '4 frets', t: 'Shows the first four frets of the guitar neck.' },
    'btn-12fret': { n: '12 frets', t: 'Shows twelve frets, a full octave up the neck.' },
    root: { n: 'Root note', t: 'Choose the home note. The pattern is built from it.' }
  },
  rules: [
    { sel: 'button', x: /Clear/i, n: 'Clear all', t: 'Removes every pattern and starts fresh.' },
    { sel: 'button', x: /Auto-Rotate/i, n: 'Auto-rotate', t: 'Turns the automatic spinning on or off.' },
    { sel: 'button', x: /PLAY|Play Pattern/, n: 'Play', t: 'Plays the notes of the pattern, one after another.' },
    { sel: 'button', x: /Triangle|Square|Pentagon|Hexagon|Heptagon|Octagon|Vesica|Flower/, own: true, t: 'Draws this sacred shape. Its points are mapped onto notes you can see and hear.' },
    { sel: 'button', x: /Triad|7th \(|Dominant 7|Diminished$|Augmented$|Maj7|m7|mMaj7|dim7|ø7/, own: true, t: 'Shows this chord as a shape. Its notes light up and play together.' },
    { sel: 'button', x: /Mode [IVX]+|Ionian|Dorian|Phrygian|Lydian|Mixolydian|Aeolian|Locrian/, own: true, t: 'Shows this mode, which is a scale started from a different note. Its notes light up on the shape.' },
    { sel: 'button', x: /Scale|Pentatonic|Harmonic|Melodic|Bebop|Octatonic|Chromatic|Whole Tone|Blues|Minor$|Major$/, own: true, t: 'Shows this scale as a shape. Its notes light up and can be played in order.' },
    { sel: 'button', x: /2nd|3rd|4th|5th|6th|7th|Tritone|Octave/, own: true, t: 'Shows this interval, the distance between two notes, as a line on the shape.' },
    { sel: '.btn-pattern', own: true, t: 'Shows this pattern on the guitar neck.' }
  ]
};
