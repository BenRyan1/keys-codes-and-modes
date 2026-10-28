/* KCM Help Mode text: Demo, Mic Test, Free Tuner landing, Access Code pages. DRAFT Oct 28 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'small-draft-1',
  ids: {
    copyBtn: { n: 'Copy prompt for Suno', t: 'Copies the song description to your clipboard so you can paste it into Suno.' },
    recBtn: { n: 'Record', t: 'Starts recording what you play. It stays on your device only.' },
    playBtn: { n: 'Play', t: 'Plays back what you recorded.' },
    stopBtn: { n: 'Stop', t: 'Stops recording or playback.' },
    btnBack: { n: 'Back', t: 'Goes back one step.' },
    btnNext: { n: 'Next', t: 'Goes to the next step.' },
    b1: { n: 'Allow mic on this page', t: 'Asks your device for permission to use the microphone, to test that it works. Nothing is recorded or sent anywhere.' },
    load: { n: 'Load Music Theory Pro', t: 'Opens Music Theory Pro so you can test the microphone there.' },
    y: { n: 'It worked', t: 'Tell us the microphone worked.' },
    n: { n: 'It did not work', t: 'Tell us the microphone did not work.' },
    lp: { n: 'Load probe', t: 'Runs a small test page that checks your microphone.' },
    'tuner-email': { n: 'Your email', t: 'Type your email address to get access to the free tuner.' },
    'tuner-submit': { n: 'Get the tuner', t: 'Sends your email and opens the free tuner.' },
    accessCode: { n: 'Access code', t: 'Type the code you were given to open the full apps.' },
    submitBtn: { n: 'Verify code', t: 'Checks your code and lets you in if it is right.' }
  },
  rules: [
    { sel: 'input[type=range]', n: 'Tempo', t: 'Slide to change the speed, in beats per minute.' },
    { sel: 'button', x: /Preview Progression/, n: 'Preview progression', t: 'Plays the chord progression so you can hear it.' },
    { sel: 'button', x: /MIDI File|MIDI$/, n: 'Download MIDI', t: 'Saves the progression as a MIDI file you can open in music software.' },
    { sel: 'button', x: /Suno Session|Suno JSON/, n: 'Download for Suno', t: 'Saves a file you can use with Suno to make a song from this progression.' },
    { sel: 'button', x: /Start Over/, n: 'Start over', t: 'Clears everything and goes back to the beginning.' },
    { sel: 'button', x: /Full Brief/, n: 'View full brief', t: 'Opens the full description in a new tab.' },
    { sel: 'button', x: /Continue Free/, n: 'Continue free', t: 'Skips the code and opens the free apps.' },
    { sel: 'button[aria-controls="mobile-nav"]', n: 'Menu', t: 'Opens or closes the navigation menu.' },
    { sel: 'summary', own: true, t: 'Touch to open or close the answer to this question.' }
  ]
};
