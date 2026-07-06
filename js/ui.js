// 📄 js/ui.js
// Centralizes all DOM manipulation
export function showCaption(id, isUserImage) {
    const capTitle = document.getElementById('caption-title');
    const capDate = document.getElementById('caption-date');
    const capDesc = document.getElementById('caption-desc');
    const capPanel = document.getElementById('caption-panel');

    if (isUserImage) {
        capTitle.innerText = `Photo #${id + 1}`;
        capDate.innerText = `UPLOADED MEMORY`;
        capDesc.innerText = 'A personal photo loaded securely from your device. It has been wrapped in our hand-drawn graphic recording frame.';
    } else {
        const locations = ['Mumbai, Maharashtra', 'Jaipur, Rajasthan', 'Munnar, Kerala', 'Pithoragarh, Uttarakhand', 'Vagator, Goa'];
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