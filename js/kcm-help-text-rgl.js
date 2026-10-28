/* KCM Help Mode text: Rhythm Geometry Lab page. DRAFT Oct 27 2026, for Ben to review. */
window.KCM_HELP = {
  version: 'rgl-draft-1',
  ids: {
    playBtn: { n: 'Play', t: 'Starts the rhythm. A line sweeps around the circle and plays each beat it touches. Touch again to pause.' },
    tempoSlider: { n: 'Tempo', t: 'Slide to change the speed, in beats per minute.' },
    stepsSlider: { n: 'Steps', t: 'How many equal slots the circle has. More steps give a finer, longer rhythm.' },
    volumeSlider: { n: 'Volume', t: 'Slide to change how loud the rhythm is.' },
    'tab-geo': { n: 'Geometry view', t: 'Shows the beats as corners of a shape inside the circle.' },
    'tab-dots': { n: 'Dots view', t: 'Shows the beats as simple dots around the circle.' },
    'tab-note': { n: 'Notes view', t: 'Shows the same rhythm written as music notes.' },
    'tab-spiral': { n: 'Spiral view', t: 'Shows the rhythm winding around in a spiral, so you can see how it repeats.' }
  },
  rules: [
    { sel: 'button', x: /Stop/, n: 'Stop', t: 'Stops the sound and returns to the start.' },
    { sel: 'button', x: /Reset/, n: 'Reset rotation', t: 'Turns the shape back to its starting position.' },
    { sel: 'button', x: /Add Layer/, n: 'Add layer', t: 'Adds another rhythm shape on top, so two or more rhythms play together.' },
    { sel: '.preset-btn', x: /Clave/, n: 'Clave preset', t: 'Loads the classic clave pattern, a five-beat rhythm heard across Latin music.' },
    { sel: '.preset-btn', x: /Bossa/, n: 'Bossa preset', t: 'Loads a bossa nova pattern.' },
    { sel: '.preset-btn', x: /Afro/, n: 'Afro preset', t: 'Loads an Afro-Cuban style pattern.' },
    { sel: '.preset-btn', x: /Poly/, n: 'Poly 3:2 preset', t: 'Loads two layers at once, three against two, so you can hear and see a polyrhythm.' },
    { sel: '.picker-btn', n: 'Number of beats', t: 'Picks how many beats the shape has. 5 gives a pentagon, 3 a triangle, and so on.' },
    { sel: '.picker-btn-horizontal', n: 'Note length', t: 'Picks which note or rest you place on the circle: whole, half, quarter or eighth.' },
    { sel: '.layer-btn', x: /🔇|🔊/, n: 'Mute layer', t: 'Silences or restores this layer.' },
    { sel: '.layer-btn', x: /×/, n: 'Remove layer', t: 'Deletes this layer.' },
    { sel: 'input[type=range]', n: 'Pulses', t: 'How many beats this layer plays within its steps.' }
  ]
};
