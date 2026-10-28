/* KCM Help Mode text: Chord Builder page. DRAFT Oct 27 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'chord-draft-1',
  ids: {
    noteInput: { n: 'Type notes', t: 'Type the letters of notes, like GBD, and the app names the chord they make.' },
    baseChordSelect: { n: 'Base chord', t: 'Choose the chord to start from. Then add extensions below to make it richer.' },
    ext7: { n: '7th', t: 'Adds the 7th note on top of the chord for a jazzier sound.' },
    ext9: { n: '9th', t: 'Adds the 9th note on top of the chord.' },
    ext11: { n: '11th', t: 'Adds the 11th note on top of the chord.' },
    ext13: { n: '13th', t: 'Adds the 13th note on top of the chord.' },
    playBtn: { n: 'Play chord', t: 'Plays the chord you built from the notes you typed.' }
  },
  rules: [
    { sel: '.caged-btn', x: /./, own: true, t: 'Shows this chord shape on the guitar neck. CAGED is a system of five shapes that cover the whole fretboard.' },
    { sel: '.caged-btn', n: 'CAGED shape', t: 'Shows this chord shape on the guitar neck. CAGED is a system of five shapes that cover the whole fretboard.' },
    { sel: '.play-button', x: /Extended/, n: 'Play extended chord', t: 'Plays the base chord with the extensions you turned on.' },
    { sel: '.example-btn', own: true, t: 'Fills in this example chord so you can see how the notes make it.' }
  ]
};
