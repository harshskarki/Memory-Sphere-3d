// 📄 js/interaction.js
// Handles all user raycasting, zooming, dragging and tweens
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { STATE } from './state.js';
import { camera, renderer, controls } from './engine.js';
import { globeGroup, filterGlobe } from './globe.js';
import { playSwish, playClick } from './audio.js';
import * as UI from './ui.js';

let raycaster, mouse, pointerDownPos;

export function initInteractions() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    pointerDownPos = new THREE.Vector2();

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);
    
    document.getElementById('back-btn').addEventListener('click', zoomOutToGlobe);
}

function onPointerDown(event) {
    if (STATE.isZoomed) return;
    STATE.isDragging = true;
    document.body.style.cursor = 'grabbing';
    pointerDownPos.set(event.clientX, event.clientY);
    
    if (STATE.hoveredMesh) {
        resetHoverState(STATE.hoveredMesh);
        STATE.hoveredMesh = null;
    }
}

function onPointerUp(event) {
    if (STATE.isZoomed) return;
    STATE.isDragging = false;
    document.body.style.cursor = STATE.hoveredMesh ? 'zoom-in' : 'default';

    const distance = Math.sqrt(Math.pow(event.clientX - pointerDownPos.x, 2) + Math.pow(event.clientY - pointerDownPos.y, 2));

    if (distance > 15) {
        if (!STATE.userHasDragged) {
            STATE.userHasDragged = true;
            document.getElementById('prompt-drag').style.opacity = '0';
        }
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(globeGroup.children);

    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (!clickedMesh.userData.isFaded) zoomIntoPanel(clickedMesh);
    }
}

function onPointerMove(event) {
    if (STATE.isZoomed || STATE.isDragging) return; 
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(globeGroup.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.isFaded) {
            if (STATE.hoveredMesh) {
                resetHoverState(STATE.hoveredMesh);
                STATE.hoveredMesh = null;
                document.body.style.cursor = 'default';
            }
            return;
        }

        if (STATE.hoveredMesh !== object) {
            if (STATE.hoveredMesh) resetHoverState(STATE.hoveredMesh);
            STATE.hoveredMesh = object;
            applyHoverState(STATE.hoveredMesh);
            document.body.style.cursor = 'zoom-in'; 
        }
    } else {
        if (STATE.hoveredMesh) {
            resetHoverState(STATE.hoveredMesh);
            STATE.hoveredMesh = null;
            document.body.style.cursor = 'default';
        }
    }
}

function applyHoverState(mesh) {
    if (mesh.userData.hoverTween) mesh.userData.hoverTween.stop();
    if (mesh.userData.hoverShaderTween) mesh.userData.hoverShaderTween.stop(); 
    
    mesh.userData.hoverTween = new TWEEN.Tween(mesh.scale).to({ x: 1.15, y: 1.15, z: 1.15 }, 200).easing(TWEEN.Easing.Quadratic.Out).start();
    mesh.userData.hoverShaderTween = new TWEEN.Tween(mesh.userData).to({ hoverIntensity: 1 }, 300).easing(TWEEN.Easing.Quadratic.Out).start();
    mesh.material.emissive.setHex(0x222222); 
}

function resetHoverState(mesh) {
    if (mesh.userData.hoverTween) mesh.userData.hoverTween.stop();
    if (mesh.userData.hoverShaderTween) mesh.userData.hoverShaderTween.stop(); 
    
    mesh.userData.hoverTween = new TWEEN.Tween(mesh.scale).to({ x: 1, y: 1, z: 1 }, 200).easing(TWEEN.Easing.Quadratic.Out).start();
    mesh.userData.hoverShaderTween = new TWEEN.Tween(mesh.userData).to({ hoverIntensity: 0 }, 400).easing(TWEEN.Easing.Quadratic.Out).start();
    mesh.material.emissive.setHex(0x000000);
}

function zoomIntoPanel(mesh) {
    if (STATE.isZoomed) return;
    STATE.isZoomed = true;
    STATE.activeMesh = mesh;
    
    if (!STATE.userHasClicked) {
        STATE.userHasClicked = true;
        const promptClick = document.getElementById('prompt-click');
        if (promptClick) promptClick.style.opacity = '0';
    }
    if (!STATE.userHasDragged) {
        STATE.userHasDragged = true;
        const promptDrag = document.getElementById('prompt-drag');
        if (promptDrag) promptDrag.style.opacity = '0';
    }

    document.body.style.cursor = 'default';
    if (STATE.hoveredMesh) {
        resetHoverState(STATE.hoveredMesh);
        STATE.hoveredMesh = null;
    }
    
    controls.enabled = false;
    mesh.userData.originalPosition = mesh.position.clone();
    mesh.userData.originalQuaternion = mesh.quaternion.clone();

    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    const targetWorldPos = camera.position.clone().add(cameraDir.multiplyScalar(250));
    const targetLocalPos = globeGroup.worldToLocal(targetWorldPos);

    new TWEEN.Tween(mesh.position).to({ x: targetLocalPos.x, y: targetLocalPos.y, z: targetLocalPos.z }, 1000).easing(TWEEN.Easing.Cubic.Out).start();

    const targetWorldQuat = camera.quaternion.clone();
    const inverseGlobeQuat = globeGroup.quaternion.clone().invert();
    const targetLocalQuat = inverseGlobeQuat.multiply(targetWorldQuat);
    const startQuat = mesh.quaternion.clone();
    const tweenObj = { t: 0 };
    
    new TWEEN.Tween(tweenObj).to({ t: 1 }, 1000).easing(TWEEN.Easing.Cubic.Out).onUpdate(() => {
        mesh.quaternion.slerpQuaternions(startQuat, targetLocalQuat, tweenObj.t);
    }).start();

    new TWEEN.Tween(mesh.scale).to({ x: 3.5, y: 3.5, z: 3.5 }, 1000).easing(TWEEN.Easing.Cubic.Out).start();

    globeGroup.children.forEach(child => {
        if (child !== mesh) new TWEEN.Tween(child.material).to({ opacity: 0.05 }, 600).start();
    });

    playSwish();
    UI.showBackButton();
    UI.showCaption(mesh.userData.id, mesh.userData.isUserImage);
}

function zoomOutToGlobe() {
    UI.hideBackButton();
    UI.hideCaption(); 
    playClick();
    
    if (STATE.activeMesh) {
        new TWEEN.Tween(STATE.activeMesh.position)
            .to({ x: STATE.activeMesh.userData.originalPosition.x, y: STATE.activeMesh.userData.originalPosition.y, z: STATE.activeMesh.userData.originalPosition.z }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut).start();

        const startQuat = STATE.activeMesh.quaternion.clone();
        const targetQuat = STATE.activeMesh.userData.originalQuaternion.clone();
        const tweenObj = { t: 0 };

        new TWEEN.Tween(tweenObj).to({ t: 1 }, 1000).easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => { STATE.activeMesh.quaternion.slerpQuaternions(startQuat, targetQuat, tweenObj.t); })
            .start();

        new TWEEN.Tween(STATE.activeMesh.scale).to({ x: 1, y: 1, z: 1 }, 1000).easing(TWEEN.Easing.Cubic.InOut)
            .onComplete(() => {
                STATE.isZoomed = false;
                STATE.activeMesh = null;
                controls.enabled = true; 
                filterGlobe();
            }).start();
    }

    globeGroup.children.forEach(child => {
        if (child !== STATE.activeMesh) {
            const targetOpacity = child.userData.isFaded ? 0.08 : 1;
            new TWEEN.Tween(child.material).to({ opacity: targetOpacity }, 1000).start();
        }
    });
}