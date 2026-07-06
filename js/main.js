// 📄 js/main.js
// The Orchestrator: Wires the modules together and runs the loop
import TWEEN from '@tweenjs/tween.js';
import { STATE } from './state.js';
import { initEngine, scene, camera, renderer, controls, particlesMesh } from './engine.js';
import { initGlobe, globeGroup, filterGlobe } from './globe.js';
import { initInteractions } from './interaction.js';
import { loadSavedMemories, handleFileUpload } from './storage.js';
import { initAudio, audioReady, ambientHum } from './audio.js';

// Wait for custom fonts to load before drawing to canvas
document.fonts.ready.then(() => {
    initEngine();
    initGlobe();
    initInteractions();
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            STATE.currentSearchTerm = e.target.value.toLowerCase().trim();
            filterGlobe();
        });
    }

    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) fileUpload.addEventListener('change', handleFileUpload);
    
    window.addEventListener('pointerdown', initAudio, { once: true });
    
    loadSavedMemories(); 
    animate(0);
});

function animate(time) {
    requestAnimationFrame(animate);

    TWEEN.update(time);
    
    controls.autoRotate = !STATE.hoveredMesh && !STATE.isZoomed && !STATE.isDragging;

    if (audioReady && ambientHum) {
        const isMoving = (!STATE.isZoomed && (controls.autoRotate || STATE.isDragging));
        const targetVol = isMoving ? -22 : -Infinity; 
        if (ambientHum.userData.currentVol !== targetVol) {
            ambientHum.userData.volNode.volume.rampTo(targetVol, 1.5); 
            ambientHum.userData.currentVol = targetVol;
        }
    }

    controls.update();

    if (particlesMesh) {
        particlesMesh.rotation.y += 0.0003;
        particlesMesh.rotation.x += 0.0001;
    }
    
    globeGroup.children.forEach(mesh => {
        if (mesh.material.userData && mesh.material.userData.shader) {
            mesh.material.userData.shader.uniforms.time.value = time * 0.001;
            mesh.material.userData.shader.uniforms.hoverState.value = mesh.userData.hoverIntensity || 0;
        }
    });

    renderer.render(scene, camera);
}