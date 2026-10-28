/* KCM Help Mode text: Holy Mole Grail page. DRAFT Oct 27 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'hmg-draft-1',
  ids: {
    audioBtn: { n: 'Start audio engine', t: 'Turns the sound on. Your device needs one touch before it can play audio.' },
    keySelector: { n: 'Root key', t: 'Choose the home note. The patterns on the circle start from it.' },
    rotateLeftBtn: { n: 'Previous key', t: 'Turns the circle back one step to the previous key.' },
    rotateRightBtn: { n: 'Next key', t: 'Turns the circle forward one step to the next key.' },
    autoRotateBtn: { n: 'Auto-rotate', t: 'Keeps turning the circle by itself so you hear the pattern in every key. Touch again to stop.' },
    resetBtn: { n: 'Reset to C', t: 'Turns the circle back to C.' },
    stepSizeSelect: { n: 'Step size', t: 'Chooses how far the circle turns each time: a half step, a fifth and so on.' },
    autoIntervalSlider: { n: 'Auto-rotate speed', t: 'Slide to change how long each key lasts during auto-rotate.' },
    autoPlayChordBtn: { n: 'Chord mode', t: 'During auto-rotate, plays each key as a chord.' },
    autoPlayArpeggioBtn: { n: 'Arpeggio mode', t: 'During auto-rotate, plays each key as a run of notes, one after another.' },
    playBtn: { n: 'Play', t: 'Plays all the lit notes together as a chord.' },
    arpeggioBtn: { n: 'Up', t: 'Plays the lit notes one after another, going up.' },
    arpeggioDownBtn: { n: 'Down', t: 'Plays the lit notes one after another, going down.' },
    clearBtn: { n: 'Clear all', t: 'Turns off every lit note and starts fresh.' },
    speedControl: { n: 'Playback speed', t: 'Slide to change how fast the notes play one after another.' }
  },
  rules: [
    { sel: '.stencil-btn', own: true, t: 'Draws this scale, mode or chord on the circle. The lit notes are the ones it uses. Touch again to turn it off.' },
    { sel: '[data-type="note-circle"], .sphere', n: 'Note', t: 'Touch to hear this note and light it up on the circle.' },
    { sel: 'button', x: /Got it|Accept/i, n: 'Got it', t: 'Closes the notice.' },
    { sel: 'button', x: /Decline|Reject/i, n: 'Decline', t: 'Closes the notice and keeps optional cookies off.' }
  ]
};
