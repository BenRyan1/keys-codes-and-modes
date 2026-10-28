/* KCM Help Mode text: Guitar Fretboard Explorer pages. DRAFT Oct 27 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'fret-draft-1',
  ids: {
    rootNote: { n: 'Root note', t: 'Choose the home note. The scale or mode is shown on the fretboard starting from it.' },
    scaleType: { n: 'Scale', t: 'Choose a scale, such as major or minor. Its notes light up on the fretboard.' },
    modeType: { n: 'Mode', t: 'Choose a mode, which is a scale started from a different note. Its notes light up on the fretboard.' },
    fret4Btn: { n: '4 frets', t: 'Shows the first four frets, enough for beginner shapes.' },
    fret5Btn: { n: '5 frets', t: 'Shows the first five frets.' },
    fret12Btn: { n: '12 frets', t: 'Shows twelve frets, a full octave up the neck.' },
    playSpeed: { n: 'Play speed', t: 'Slide to change how fast the scale is played. Left is faster.' },
    ascendBtn: { n: 'Ascending', t: 'Plays the scale going up, low note to high note.' },
    descendBtn: { n: 'Descending', t: 'Plays the scale going down, high note to low note.' },
    bothBtn: { n: 'Up and down', t: 'Plays the scale up and then back down.' },
    playPatternBtn: { n: 'Play scale pattern', t: 'Plays the notes of the chosen scale one after another so you can hear it.' },
    stopPatternBtn: { n: 'Stop', t: 'Stops the scale playing.' },
    playChordBtn: { n: 'Strum chord', t: 'Plays the notes of the chosen chord together, like a strum.' }
  },
  rules: [
    { sel: '.string-label', n: 'Open string', t: 'Touch to hear this open string, the note it plays with no finger on the neck.' },
    { sel: '.note-dot', n: 'Note on the neck', t: 'Touch to hear this note. Its letter shows which note you get at this string and fret.' },
    { sel: '.chord-btn', n: 'Chord', t: 'Shows this chord on the fretboard and chooses it to strum. A letter alone is major, an m after it is minor.', own: false },
    { sel: 'button', x: /^\s*Accept/i, n: 'Accept', t: 'Closes the notice.' },
    { sel: 'button', x: /^\s*Decline|Reject/i, n: 'Decline', t: 'Closes the notice and keeps optional cookies off.' }
  ]
};
