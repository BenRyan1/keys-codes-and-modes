/* KCM Help Mode text: Chromatic Mandala, Harmonized Chromatic Scale, Rhythm Clock. DRAFT Oct 28 2026. */
window.KCM_HELP = {
  version: 'mandala-draft-1',
  ids: {
    'btn-chromatic': { n: 'Chromatic circle', t: 'Arranges the twelve notes in order, one half step apart, around the circle.' },
    'btn-fifths': { n: 'Circle of fifths', t: 'Arranges the twelve notes so each next one is a fifth higher.' },
    keySelect: { n: 'Key', t: 'Choose the home note for the pattern.' },
    loopBtn: { n: 'Start loop', t: 'Plays the pattern over and over. Touch again to stop.' },
    rotateLeft: { n: 'Rotate left', t: 'Turns the pattern one step back.' },
    rotateRight: { n: 'Rotate right', t: 'Turns the pattern one step forward.' },
    playHarmonizedScale: { n: 'Play harmonized scale', t: 'Plays a chord on each note of the scale, going up.' },
    playHarmonizedScaleDescend: { n: 'Play descending', t: 'Plays a chord on each note of the scale, going down.' },
    ascendBtn: { n: 'Ascend', t: 'Chooses to play the scale going up.' },
    descendBtn: { n: 'Descend', t: 'Chooses to play the scale going down.' },
    toggleViewBtn: { n: 'Switch fret view', t: 'Switches the guitar neck between 5 and 12 frets.' },
    audioToggle: { n: 'Sound', t: 'Turns the sound on or off.' },
    playBtn: { n: 'Play', t: 'Plays the rhythm. Touch again to pause.' },
    stopBtn: { n: 'Stop', t: 'Stops and goes back to the start.' },
    tempoSlider: { n: 'Tempo', t: 'Slide to change the speed, in beats per minute.' }
  },
  rules: [
    { sel: '.key-btn', own: true, t: 'Chooses this note as the key. The harmonized scale is built from it.' },
    { sel: '.btn-subdivision', own: true, t: 'Chooses this note length to place on the clock. Whole is one beat per cycle, 32nd is thirty-two.' },
    { sel: '[id^="sym-"]', own: true, t: 'Repeats the pattern this many times around the circle, for a symmetrical design.' },
    { sel: 'button', x: /Major Chord|Minor Chord|Power Chord/, own: true, t: 'Draws this chord on the circle. Its notes light up.' },
    { sel: 'button', x: /Major Scale|Pentatonic|Blues/, own: true, t: 'Draws this scale on the circle. Its notes light up.' },
    { sel: 'button', x: /Play All/, n: 'Play all', t: 'Plays every lit note.' },
    { sel: 'button', x: /Clear/, n: 'Clear', t: 'Removes everything and starts fresh.' },
    { sel: 'button[data-type]', own: true, t: 'Chooses which kind of chord is built on each note of the scale.' },
    { sel: 'button', x: /^(Whole|Half|Quarter|Eighth|16th|32nd)$/, own: true, t: 'Chooses this note length to place on the clock.' },
    { sel: 'button', x: /Triad|Pentatonic|Scale|Tresillo|Custom|All Beats/, own: true, t: 'Loads this rhythm pattern onto the clock.' }
  ]
};
