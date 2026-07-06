// 📄 js/ui.js
import { set } from 'idb-keyval';
import { STATE } from './state.js';
import { globeGroup } from './globe.js';

let currentActiveId = null;

export function initUI() {
    // Edit Button Click
    document.getElementById('edit-caption-btn')?.addEventListener('click', () => {
        const meta = STATE.userMetadata[currentActiveId];
        if (!meta) return;

        document.getElementById('caption-display-block').classList.add('hidden');
        document.getElementById('caption-edit-form').classList.remove('hidden');
        document.getElementById('caption-edit-form').classList.add('flex');

        document.getElementById('edit-title').value = meta.title || '';
        document.getElementById('edit-date').value = meta.date || '';
        document.getElementById('edit-location').value = meta.location || '';
        document.getElementById('edit-desc').value = meta.desc || '';
    });

    // Save Button Click
    document.getElementById('save-caption-btn')?.addEventListener('click', async () => {
        const updatedMeta = {
            title: document.getElementById('edit-title').value,
            date: document.getElementById('edit-date').value,
            location: document.getElementById('edit-location').value,
            desc: document.getElementById('edit-desc').value
        };

        // Update UI Text Instantly
        document.getElementById('caption-title').innerText = updatedMeta.title;
        document.getElementById('caption-date').innerText = updatedMeta.location ? `${updatedMeta.date} • ${updatedMeta.location}` : updatedMeta.date;
        document.getElementById('caption-desc').innerText = updatedMeta.desc;

        // Switch back to Display Mode
        document.getElementById('caption-display-block').classList.remove('hidden');
        document.getElementById('caption-edit-form').classList.add('hidden');
        document.getElementById('caption-edit-form').classList.remove('flex');

        // Save to IndexedDB and update Live Search tags
        STATE.userMetadata[currentActiveId] = updatedMeta;
        await set('globe_metadata', STATE.userMetadata);
        
        const mesh = globeGroup.children.find(m => m.userData.id === currentActiveId);
        if(mesh) {
             mesh.userData.searchTags = `${updatedMeta.title} ${updatedMeta.location} ${updatedMeta.date}`.toLowerCase();
        }
    });
}

export function showCaption(id, isUserImage) {
    currentActiveId = id;
    const capTitle = document.getElementById('caption-title');
    const capDate = document.getElementById('caption-date');
    const capDesc = document.getElementById('caption-desc');
    const capPanel = document.getElementById('caption-panel');
    const editBtn = document.getElementById('edit-caption-btn');
    
    // Always open in Display Mode
    document.getElementById('caption-display-block').classList.remove('hidden');
    document.getElementById('caption-edit-form').classList.add('hidden');
    document.getElementById('caption-edit-form').classList.remove('flex');

    if (isUserImage) {
        editBtn.classList.remove('hidden'); // Show Edit Pencil
        const meta = STATE.userMetadata[id];
        capTitle.innerText = meta.title;
        capDate.innerText = meta.location ? `${meta.date} • ${meta.location}` : meta.date;
        capDesc.innerText = meta.desc;
    } else {
        editBtn.classList.add('hidden'); // Hide Edit Pencil for Demos
        const locations = ['Maharashtra', 'Rajasthan', 'Kerala', 'Uttarakhand', 'Goa'];
        const notes = [
            'An incredible day exploring the bustling streets and trying local vada pav.',
            'A quiet afternoon spent wandering around the majestic forts and palaces.',
            'Unforgettable moments cruising through the peaceful green backwaters.',
            'Found this amazing little Maggie point in the snowy mountains completely by accident.',
            'Relaxing by the beach with great company and incredible coastal seafood.'
        ];
        capTitle.innerText = `Note #${id + 1}`;
        capDate.innerText = `AUG ${(id % 28) + 1}, 202${(id % 4) + 1} • ${locations[id % locations.length]}`;
        capDesc.innerText = notes[id % notes.length];
    }
    
    capPanel.style.opacity = '1';
    capPanel.style.transform = 'translate(0, -50%)'; 
    capPanel.style.pointerEvents = 'auto';
}

export function hideCaption() {
    const capPanel = document.getElementById('caption-panel');
    capPanel.style.opacity = '0';
    capPanel.style.transform = 'translate(40px, -50%)'; 
    capPanel.style.pointerEvents = 'none';
}

export function showBackButton() {
    const backBtn = document.getElementById('back-btn');
    backBtn.style.opacity = '1';
    backBtn.style.transform = 'translateY(0)';
    backBtn.style.pointerEvents = 'auto';
    const topUi = document.getElementById('top-ui-block');
    if(topUi) {
        topUi.style.opacity = '0';
        topUi.style.pointerEvents = 'none';
    }
}

export function hideBackButton() {
    const backBtn = document.getElementById('back-btn');
    backBtn.style.opacity = '0';
    backBtn.style.transform = 'translateY(20px)';
    backBtn.style.pointerEvents = 'none';
    const topUi = document.getElementById('top-ui-block');
    if(topUi) {
        topUi.style.opacity = '1';
        topUi.style.pointerEvents = ''; 
    }
}

export function showLoading(text) {
    const loadingOverlay = document.getElementById('loading-overlay');
    document.getElementById('loading-text').innerText = text;
    loadingOverlay.classList.remove('opacity-0', 'pointer-events-none');
    loadingOverlay.classList.add('opacity-100', 'pointer-events-auto');
}

export function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    loadingOverlay.classList.add('opacity-0', 'pointer-events-none');
}