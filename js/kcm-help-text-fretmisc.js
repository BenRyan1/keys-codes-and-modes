/* KCM Help Mode text: CAGED Stencil Fretboard, Fretboard Speed Challenge, KCM Guitar Fretboard. DRAFT Oct 27 2026. */
window.KCM_HELP = {
  version: 'fretmisc-draft-1',
  ids: {
    chordType: { n: 'Chord type', t: 'Choose the kind of chord: major, minor, seventh and so on.' },
    clearAll: { n: 'Clear', t: 'Removes everything from the neck.' },
    audioInit: { n: 'Turn on sound', t: 'Starts the sound. Your device needs one touch before it can play audio.' },
    playChord: { n: 'Play', t: 'Plays the chord notes one after another.' },
    strumChord: { n: 'Strum', t: 'Plays the chord all at once, like a strum.' },
    moveUp: { n: 'Move up', t: 'Moves the chosen chord shape up the neck.' },
    moveDown: { n: 'Move down', t: 'Moves the chosen chord shape down the neck.' },
    removeChord: { n: 'Remove', t: 'Deletes the chosen chord shape from the neck.' },
    startBtn: { n: 'Start challenge', t: 'Starts the timed game. Find each note on the neck as fast as you can.' },
    pauseBtn: { n: 'Pause', t: 'Pauses the game.' },
    copyBtn: { n: 'Copy score', t: 'Copies your score so you can paste it somewhere.' },
    audioToggle: { n: 'Audio', t: 'Turns the sound on or off.' },
    tempoSlider: { n: 'Tempo', t: 'Slide to change the speed, in beats per minute.' }
  },
  rules: [
    { sel: '.stencil-btn', n: 'Chord shape', t: 'Puts this chord shape on the neck. The five shapes are C, A, G, E and D, called CAGED.' },
    { sel: '.control-btn', x: /Frets/, own: true, t: 'Chooses how many frets the neck shows.' },
    { sel: '.dbtn', n: 'Difficulty', t: 'Chooses how hard the game is.' },
    { sel: 'button', x: /Play Again/, n: 'Play again', t: 'Starts a new round.' },
    { sel: 'button', x: /Change Difficulty/, n: 'Change difficulty', t: 'Goes back to pick an easier or harder level.' },
    { sel: 'button', x: /Share/, n: 'Share score', t: 'Opens your device share menu so you can send your score.' },
    { sel: '.cookie-accept', n: 'Accept', t: 'Closes the notice.' },
    { sel: '.cookie-decline', n: 'Decline', t: 'Closes the notice and keeps optional cookies off.' },
    { sel: 'button', x: /Frets/, own: true, t: 'Chooses how many frets the neck shows.' },
    { sel: 'button', x: /Shape$/, own: true, t: 'Shows this chord shape on the neck.' },
    { sel: 'button', x: /Strum/, n: 'Strum', t: 'Plays the notes together, like a strum.' },
    { sel: 'button', x: /Pentatonic|Major Scale|Minor Scale|Blues Scale/, own: true, t: 'Shows this scale on the neck.' },
    { sel: 'button', x: /Scale Run/, own: true, t: 'Plays the scale as a run up the neck.' },
    { sel: 'button', x: /Arpeggio/, own: true, t: 'Plays the chord notes one at a time, as an arpeggio.' },
    { sel: 'button', x: /Octave Positions/, own: true, t: 'Shows the same note in different places an octave apart.' },
    { sel: 'button', x: /Clear/, n: 'Clear all', t: 'Removes everything from the neck.' }
  ]
};
