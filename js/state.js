// 📄 js/state.js
// Centralized state manager to prevent circular dependencies
export const CONFIG = {
    radius: 300,
    imageCount: 90,
    panelSize: 55,
    zoomDistance: 80, 
    orbitDistance: 800 
};

export const STATE = {
    isZoomed: false,
    activeMesh: null,
    hoveredMesh: null,
    isDragging: false,
    userHasDragged: false,
    userHasClicked: false,
    userTextures: [],
    currentSearchTerm: ""
};