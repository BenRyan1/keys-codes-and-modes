/* KCM Help Mode text: Tuner page. DRAFT Oct 27 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'tuner-draft-1',
  ids: {
    enableMicBtn: { n: 'Enable microphone', t: 'Asks your device for permission to listen, so the tuner can tell you if a string is sharp or flat. Nothing is recorded or sent anywhere.' },
    guitarTuning: { n: 'Guitar tuning', t: 'Choose which tuning to use, such as standard or drop D. The strings below change to match.' },
    bassTuning: { n: 'Bass tuning', t: 'Choose which bass tuning to use. The strings below change to match.' },
    ukukleTuning: { n: 'Ukulele tuning', t: 'Choose which ukulele tuning to use. The strings below change to match.' },
    banjoTuning: { n: 'Banjo tuning', t: 'Choose which banjo tuning to use. The strings below change to match.' },
    mandolinTuning: { n: 'Mandolin tuning', t: 'Choose which mandolin tuning to use. The strings below change to match.' }
  },
  rules: [
    { sel: '.cookie-btn.accept', n: 'Got it', t: 'Closes the notice.' },
    { sel: '.cookie-btn.decline', n: 'Decline', t: 'Closes the notice and keeps optional cookies off.' },
    { sel: '.tab-btn', x: /Guitar/i, n: 'Guitar', t: 'Tune a guitar.' },
    { sel: '.tab-btn', x: /Bass/i, n: 'Bass', t: 'Tune a bass.' },
    { sel: '.tab-btn', x: /Ukulele/i, n: 'Ukulele', t: 'Tune a ukulele.' },
    { sel: '.tab-btn', x: /Banjo/i, n: 'Banjo', t: 'Tune a banjo.' },
    { sel: '.tab-btn', x: /Mandolin/i, n: 'Mandolin', t: 'Tune a mandolin.' },
    { sel: '.ctrl-btn', x: /Play All/, n: 'Play all strings', t: 'Plays each string note one after another, so you can tune by ear.' },
    { sel: '.ctrl-btn', x: /Stop/, n: 'Stop', t: 'Stops all sound right now.' },
    { sel: '.ctrl-btn', x: /Reset/, n: 'Reset', t: 'Clears the tuner meter and starts fresh.' },
    { sel: '.play-btn', n: 'Play this string', t: 'Plays the note this string should be. Touch again to stop. Tune your string until it matches.' },
    { sel: 'select.tuning-select', n: 'Tuning', t: 'Choose which tuning to use. The strings below change to match.' }
  ]
};
