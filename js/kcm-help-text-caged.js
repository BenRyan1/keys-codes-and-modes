/* KCM Help Mode text: CAGED 1-4-5 Master page. DRAFT Oct 27 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'caged-draft-1',
  ids: {
    tempoSlider: { n: 'Tempo', t: 'Slide to change how fast the progression plays, in beats per minute.' },
    positionSlider: { n: 'Neck position', t: 'Slide the chord shape up and down the guitar neck, fret by fret.' },
    playBtn: { n: 'Play I-IV-V-I', t: 'Plays the classic three-chord progression in the chosen key. Touch again to stop.' },
    play251Btn: { n: 'Play ii-V-I', t: 'Plays the ii, V, I jazz progression in the chosen key. Touch again to stop.' },
    modeNote: { n: 'Notes game', t: 'Ear training: you hear a note and pick its name.' },
    modeInterval: { n: 'Intervals game', t: 'Ear training: you hear two notes and pick the distance between them.' },
    modeChord: { n: 'Chords game', t: 'Ear training: you hear a chord and pick what kind it is.' },
    modeShape: { n: 'CAGED shapes game', t: 'Ear training: you hear a chord and pick which of the five CAGED shapes it is.' },
    unityExportCode: { n: 'Exported code', t: 'The code for this chord shape, ready to copy into a Unity project.' }
  },
  rules: [
    { sel: '.form-btn', n: 'CAGED form', t: 'Chooses which of the five chord shapes (C, A, G, E, D) to show on the neck.' },
    { sel: '.root-btn', n: 'Root note', t: 'Chooses the home note of the chord. The shape moves to the right place on the neck.' },
    { sel: '.type-btn', n: 'Chord type', t: 'Chooses the kind of chord: major, minor, seventh and so on.' },
    { sel: '.chord-btn', n: 'Chord in the progression', t: 'Shows and plays this chord of the progression on the neck.' },
    { sel: '.ear-play-btn', n: 'Play sound', t: 'Plays the sound for this question. Touch again to hear it once more.' },
    { sel: '.ear-answer-btn', n: 'Answer', t: 'Choose this as your answer to the listening question.' },
    { sel: 'button', x: /^60$|^90$|^120$|^150$|^180$/, n: 'Tempo preset', t: 'Jumps to this speed, in beats per minute.' },
    { sel: 'button', x: /◀$/, n: 'Down one fret', t: 'Moves the shape one fret toward the head of the guitar.' },
    { sel: 'button', x: /^▶$/, n: 'Up one fret', t: 'Moves the shape one fret toward the body of the guitar.' },
    { sel: 'button', x: /Initialize|🔊$/, n: 'Turn on sound', t: 'Starts the sound. Your device needs one touch before it can play audio.' },
    { sel: 'button', x: /Play Chord Tones/, n: 'Play chord tones', t: 'Plays the notes of the chosen chord one after another.' },
    { sel: 'button', x: /Strum/, n: 'Strum', t: 'Plays the chord all at once, like a strum.' },
    { sel: 'button', x: /^▶ Play$/, n: 'Play chord', t: 'Plays the chosen chord.' },
    { sel: 'button', x: /Unity/, n: 'Unity export', t: 'Makes code for this chord shape that game builders can use in Unity.' },
    { sel: 'button', x: /Copy Code/, n: 'Copy code', t: 'Copies the code to your clipboard.' },
    { sel: 'button', x: /^(×|Close)$/, n: 'Close', t: 'Closes this panel.' },
    { sel: 'button', x: /Oct/, n: 'Octave', t: 'Moves the sound up or down one octave, which is eight notes higher or lower.' },
    { sel: 'button', x: /Got it/, n: 'Got it', t: 'Closes the notice.' }
  ]
};
