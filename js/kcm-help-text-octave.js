/* KCM Help Mode text: Octave Wave Visualizer pages (all variants). DRAFT Oct 28 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'octave-draft-1',
  ids: {
    noteSelector: { n: 'Note', t: 'Choose which note to look at. Each octave of that note is shown as a wave, twice as fast as the one before.' },
    autoRotateBtn: { n: 'Auto-rotate', t: 'Spins the 3D view by itself. Touch again to stop it.' },
    tunnelFlyBtn: { n: 'Fly through center', t: 'Moves the camera through the middle of the spheres so you can see them from inside.' },
    topDownBtn: { n: 'Top-down view', t: 'Looks straight down on the waves, like a map.' },
    waterfallBtn: { n: 'Waterfall view', t: 'Shows the waves stacked in a cascade, one behind the next.' },
    registerSlider: { n: 'Register', t: 'Slide to choose how high or low the root note is, from deep bass to high treble.' },
    sweepSpeedSlider: { n: 'Sweep speed', t: 'Slide to change how fast the notes sweep up or down.' },
    zoomActivateCheckbox: { n: 'Zoom to active note', t: 'When on, the view moves in on the note that is playing.' },
    midiOutCheckbox: { n: 'MIDI out', t: 'When on, sends the notes to a MIDI device you have connected.' },
    melodyText: { n: 'Melody text', t: 'Type note letters, like E D C D E. Commas make a pause. Then touch Play Typed Melody.' },
    melodyTempoSlider: { n: 'Melody tempo', t: 'Slide to change how fast the typed melody plays.' },
    midiFileInput: { n: 'Load MIDI file', t: 'Pick a .mid file from your device to play and watch.' },
    playMidiBtn: { n: 'Play loaded MIDI', t: 'Plays the MIDI file you loaded.' },
    melodySpeedSlider: { n: 'Playback speed', t: 'Slide to play the melody slower or faster.' },
    lockTempoCheckbox: { n: 'Lock tempo', t: 'When on, keeps the tempo you tapped fixed.' },
    beatClockCheckbox: { n: 'Beat clock', t: 'When on, shows a clock that ticks with the beat.' },
    liveAudioCheckbox: { n: 'Live audio', t: 'When on, listens through your microphone and shows the notes you play or sing. Nothing is recorded or sent anywhere.' },
    micSensitivitySlider: { n: 'Mic sensitivity', t: 'Slide to make the microphone pick up quieter or only louder sounds.' },
    octavePauseSlider: { n: 'Pause between octaves', t: 'Slide to change the gap between octaves when they play one after another.' },
    sumWaveToggle: { n: 'Sum wave', t: 'When on, shows the waves added together as one combined wave.' }
  },
  rules: [
    { sel: '.octave-play-btn', n: 'Play this octave', t: 'Plays the note in this octave so you can hear and see its wave. Each octave is twice as fast as the last.' },
    { sel: '.note-btn', own: true, t: 'Chooses this note to look at. Its octaves are shown as waves.' },
    { sel: 'button', x: /Reset View/, n: 'Reset view', t: 'Puts the camera back where it started.' },
    { sel: 'button', x: /Play Root/, n: 'Play root', t: 'Plays the root note.' },
    { sel: 'button', x: /Sweep Ascending/, n: 'Sweep up', t: 'Plays the note in every octave, from the root going up.' },
    { sel: 'button', x: /Sweep Descending/, n: 'Sweep down', t: 'Plays the note in every octave, from the root going down.' },
    { sel: 'button', x: /Stop All|Stop Melody/, n: 'Stop', t: 'Stops all sound right now.' },
    { sel: 'button', x: /Play Typed Melody/, n: 'Play typed melody', t: 'Plays the melody you typed in the box.' },
    { sel: 'button', x: /Tap Tempo/, n: 'Tap tempo', t: 'Tap this in time with a beat and the app works out the speed.' },
    { sel: 'button', x: /Play Current/, n: 'Play current', t: 'Plays the chosen note at its current octave.' },
    { sel: 'button', x: /Play All/, n: 'Play all', t: 'Plays the note in every octave together.' },
    { sel: 'button', x: /Play Scale/, n: 'Play scale', t: 'Plays the note in every octave one after another, from low to high.' },
    { sel: 'button', x: /Build Sequence/, n: 'Build sequence', t: 'Adds this note to a sequence you can play back in order.' },
    { sel: 'button', x: /^\S*\s*Play$/, n: 'Play this octave', t: 'Plays the note in this octave so you can hear and see its wave.' },
    { sel: 'input[type=checkbox]', n: 'Option', t: 'Switch this option on or off.' },
    { sel: 'input[type=range]', n: 'Slider', t: 'Slide to change this setting.' }
  ]
};
