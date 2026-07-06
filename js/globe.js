// 📄 js/globe.js
// Math engine for the Sphere generation and dynamic scaling
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { CONFIG, STATE } from './state.js';
import { scene, camera, controls } from './engine.js';
import { createUserImageTexture, createProceduralTexture } from './graphics.js';
import { ShaderChunks } from './shaders.js';

export let globeGroup = new THREE.Group();

export function initGlobe() {
    scene.add(globeGroup);
    buildFibonacciSphere();
}

function buildFibonacciSphere() {
    const numPoints = CONFIG.imageCount;
    const radius = CONFIG.radius;
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    const geometry = new THREE.PlaneGeometry(CONFIG.panelSize, CONFIG.panelSize, 16, 16);

    for (let i = 0; i < numPoints; i++) {
        let texture = (STATE.userTextures.length > 0) 
            ? STATE.userTextures[i % STATE.userTextures.length] 
            : createProceduralTexture(i);
        
        const material = new THREE.MeshStandardMaterial({ 
            map: texture, side: THREE.FrontSide, roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0
        });

        material.onBeforeCompile = (shader) => {
            shader.uniforms.time = { value: 0 };
            shader.uniforms.hoverState = { value: 0 };
            material.userData.shader = shader; 
            
            shader.vertexShader = shader.vertexShader.replace('void main() {', ShaderChunks.vertexInit);
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', ShaderChunks.vertexFlutter);
            shader.fragmentShader = shader.fragmentShader.replace('void main() {', ShaderChunks.fragmentInit);
            shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', ShaderChunks.fragmentTear);
        };

        const mesh = new THREE.Mesh(geometry, material);
        const y = 1 - (i / (numPoints - 1)) * 2; 
        const mathRadius = Math.sqrt(1 - y * y); 
        const theta = phi * i; 

        const x = Math.cos(theta) * mathRadius;
        const z = Math.sin(theta) * mathRadius;

        mesh.position.set(x * radius, y * radius, z * radius);
        const lookVec = new THREE.Vector3(x, y, z).normalize().multiplyScalar(radius * 2);
        mesh.lookAt(lookVec);

        const locations = ['Tokyo', 'Paris', 'New York', 'London', 'Kyoto'];
        const baseTag = STATE.userTextures.length > 0 ? 'uploaded memory photo' : 'memory note';
        const searchString = `${baseTag} ${i + 1} ${locations[i % locations.length]}`.toLowerCase();

        mesh.userData = { 
            id: i, originalPosition: mesh.position.clone(), isUserImage: STATE.userTextures.length > 0,
            searchTags: searchString, isFaded: false, hoverIntensity: 0
        };

        globeGroup.add(mesh);
        new TWEEN.Tween(material).to({ opacity: 1 }, 1000).delay(i * 15).easing(TWEEN.Easing.Quadratic.Out).start();
    }
}

export function rebuildGlobe() {
    for (let i = globeGroup.children.length - 1; i >= 0; i--) {
        const mesh = globeGroup.children[i];
        mesh.geometry.dispose();
        if(mesh.material.map) mesh.material.map.dispose();
        mesh.material.dispose();
        globeGroup.remove(mesh);
    }

    const panelArea = CONFIG.panelSize * CONFIG.panelSize;
    const spacingMultiplier = 3.5; 
    const totalRequiredArea = CONFIG.imageCount * panelArea * spacingMultiplier;
    
    let newRadius = Math.sqrt(totalRequiredArea / (4 * Math.PI));
    CONFIG.radius = Math.max(60, newRadius); 
    CONFIG.orbitDistance = CONFIG.radius * 2.2 + 200; 
    
    const currentDir = camera.position.clone().normalize();
    const targetPos = currentDir.multiplyScalar(CONFIG.orbitDistance);
    
    new TWEEN.Tween(camera.position).to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 1500).easing(TWEEN.Easing.Cubic.InOut).start();
    controls.minDistance = CONFIG.radius + 80;
    controls.maxDistance = Math.max(1000, CONFIG.radius * 5);

    buildFibonacciSphere();
}

export function filterGlobe() {
    if (STATE.isZoomed) return; 
    
    globeGroup.children.forEach(mesh => {
        const match = STATE.currentSearchTerm === "" || mesh.userData.searchTags.includes(STATE.currentSearchTerm);
        if (mesh.userData.filterScaleTween) mesh.userData.filterScaleTween.stop();
        if (mesh.userData.filterOpacityTween) mesh.userData.filterOpacityTween.stop();
        
        const targetScale = match ? 1 : 0.4; 
        const targetOpacity = match ? 1 : 0.08; 
        const targetEmissive = (match && STATE.currentSearchTerm !== "") ? 0x003333 : 0x000000;
        mesh.material.emissive.setHex(targetEmissive);

        mesh.userData.filterScaleTween = new TWEEN.Tween(mesh.scale).to({ x: targetScale, y: targetScale, z: targetScale }, 600).easing(TWEEN.Easing.Cubic.Out).start();
        mesh.userData.filterOpacityTween = new TWEEN.Tween(mesh.material).to({ opacity: targetOpacity }, 600).easing(TWEEN.Easing.Cubic.Out).start();
        mesh.userData.isFaded = !match; 
    });
}