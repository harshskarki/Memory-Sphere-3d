// 📄 js/storage.js
import { get, set } from 'idb-keyval';
import { CONFIG, STATE } from './state.js';
import { rebuildGlobe } from './globe.js';
import { createUserImageTexture } from './graphics.js';
import * as UI from './ui.js';

export async function loadSavedMemories() {
    try {
        const savedFiles = await get('globe_photos');
        const savedMeta = await get('globe_metadata'); // Pull text from database
        
        if (savedFiles && savedFiles.length > 0) {
            UI.showLoading("Restoring memory...");
            STATE.userTextures = []; 
            STATE.userMetadata = savedMeta || []; 
            
            for (let i = 0; i < savedFiles.length; i++) {
                document.getElementById('loading-text').innerText = `Restoring memory ${i + 1} of ${savedFiles.length}`;
                const file = savedFiles[i];
                const url = URL.createObjectURL(file);
                const img = new Image();
                img.src = url;
                await new Promise(resolve => img.onload = resolve);
                
                const texture = createUserImageTexture(img, i);
                STATE.userTextures.push(texture);
                
                // If text is missing, create a default template
                if (!STATE.userMetadata[i]) {
                    STATE.userMetadata[i] = {
                        title: `Photo #${i + 1}`,
                        date: new Date().toLocaleDateString(),
                        location: 'Uploaded Memory',
                        desc: 'A personal photo loaded securely from your device. Click the pencil icon to edit this caption.'
                    };
                }
            }

            document.getElementById('loading-text').innerText = `Rebuilding the 3D Sphere...`;
            CONFIG.imageCount = STATE.userTextures.length;
            rebuildGlobe();
            
            setTimeout(() => {
                UI.hideLoading(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> Upload More`);
            }, 800);
        }
    } catch (error) {
        console.error("Failed to load memories from IndexedDB:", error);
    }
}

export async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try { await set('globe_photos', files); } catch (err) { console.error(err); }

    UI.showLoading("Preparing photos...");
    STATE.userTextures = []; 
    STATE.userMetadata = []; // Clear old metadata on fresh upload
    
    for (let i = 0; i < files.length; i++) {
        document.getElementById('loading-text').innerText = `Preparing photo ${i + 1} of ${files.length}`;
        const file = files[i];
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        await new Promise(resolve => img.onload = resolve);
        
        const texture = createUserImageTexture(img, i);
        STATE.userTextures.push(texture);
        
        // Generate defaults for new files
        STATE.userMetadata.push({
            title: `Photo #${i + 1}`,
            date: new Date().toLocaleDateString(),
            location: 'Uploaded Memory',
            desc: 'A personal photo loaded securely from your device. Click the pencil icon above to add your own story.'
        });
    }
    
    // Save defaults to database immediately
    await set('globe_metadata', STATE.userMetadata);

    document.getElementById('loading-text').innerText = `Building the 3D Sphere...`;
    CONFIG.imageCount = STATE.userTextures.length;
    rebuildGlobe();
    
    setTimeout(() => {
        UI.hideLoading(`Loaded ${files.length} Photos!`);
        setTimeout(() => {
            const uploadLabel = document.getElementById('upload-label');
            if (uploadLabel) uploadLabel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> Upload More`;
        }, 3000);
    }, 800); 
}