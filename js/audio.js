// 📄 js/audio.js
// Handles spatial synthesis via Tone.js
let audioInitialized = false;
export let audioReady = false;
export let ambientHum = null;
let paperSwish, mechClick;

export async function initAudio() {
    if (audioInitialized) return;
    audioInitialized = true;
    
    // Tone is loaded globally via CDN in index.html
    await Tone.start();
    
    paperSwish = new Tone.NoiseSynth({
        noise: { type: "pink" },
        envelope: { attack: 0.05, decay: 0.4, sustain: 0, release: 0.1 }
    });
    const swishFilter = new Tone.Filter(900, "lowpass").toDestination();
    paperSwish.connect(swishFilter);
    paperSwish.volume.value = -8;

    mechClick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        oscillator: { type: "square" },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 }
    }).toDestination();
    mechClick.volume.value = -18;

    ambientHum = new Tone.Oscillator(45, "sine").start();
    const humVol = new Tone.Volume(-Infinity).toDestination();
    ambientHum.connect(humVol);
    ambientHum.userData = { volNode: humVol, currentVol: -Infinity };

    audioReady = true;
}

export function playSwish() {
    if (!audioReady) return;
    paperSwish.triggerAttackRelease("8n");
}

export function playClick() {
    if (!audioReady) return;
    mechClick.triggerAttackRelease("C4", "32n");
}