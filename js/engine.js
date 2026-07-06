// 📄 js/engine.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONFIG } from './state.js';

export let scene, camera, renderer, controls, particlesMesh, planetGroup;

export function initEngine() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.0012); // Slightly thicker fog for deep space

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.z = CONFIG.orbitDistance;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.enablePan = false;
    controls.minDistance = 400;
    controls.maxDistance = 1200;
    controls.autoRotate = true; 
    controls.autoRotateSpeed = 1.2; 

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 2);
    scene.add(dirLight);

    // --- 1. DYNAMIC GALAXY STARS ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500; // Increased star count
    const posArray = new Float32Array(particlesCount * 3);
    const velocityArray = new Float32Array(particlesCount * 3); // Track star speed

    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 3500;
        posArray[i+1] = (Math.random() - 0.5) * 3500;
        posArray[i+2] = (Math.random() - 0.5) * 3500;

        // Velocity (Drift speed)
        velocityArray[i] = (Math.random() - 0.5) * 1.5;
        velocityArray[i+1] = (Math.random() - 0.5) * 1.5;
        velocityArray[i+2] = (Math.random() - 0.5) * 1.5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 2.5, color: 0x2dd4bf, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending
    });
    particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- 2. LOW-POLY BACKGROUND PLANETS ---
    planetGroup = new THREE.Group();
    scene.add(planetGroup);
    
    const planetColors = [0x2dd4bf, 0xfb923c, 0xf87171, 0x818cf8, 0xa78bfa];
    for (let i = 0; i < 12; i++) { // 12 distant planets
        const size = Math.random() * 50 + 20;
        // Icosahedron gives a really cool stylized, low-poly aesthetic
        const pGeo = new THREE.IcosahedronGeometry(size, 1); 
        const pMat = new THREE.MeshStandardMaterial({
            color: planetColors[i % planetColors.length],
            flatShading: true, // Enhances the geometric look
            roughness: 0.9
        });
        const planet = new THREE.Mesh(pGeo, pMat);
        
        planet.position.set(
            (Math.random() - 0.5) * 3500,
            (Math.random() - 0.5) * 3500,
            (Math.random() - 0.5) * 3500
        );
        // Push planets away from the center so they don't clip into the photos
        if (planet.position.length() < 1000) planet.position.multiplyScalar(2.5);
        
        planetGroup.add(planet);
    }

    window.addEventListener('resize', onWindowResize);
}

// --- 3. PHYSICS UPDATE LOOP ---
export function updateGalaxy(activeRaycaster) {
    if (!particlesMesh) return;
    
    const positions = particlesMesh.geometry.attributes.position.array;
    const velocities = particlesMesh.geometry.attributes.velocity.array;

    for(let i = 0; i < positions.length; i += 3) {
        // Drift the stars organically
        positions[i] += velocities[i];
        positions[i+1] += velocities[i+1];
        positions[i+2] += velocities[i+2];

        // Wrap stars around to the other side of the universe if they fly too far
        if (Math.abs(positions[i]) > 2000) positions[i] *= -0.99;
        if (Math.abs(positions[i+1]) > 2000) positions[i+1] *= -0.99;
        if (Math.abs(positions[i+2]) > 2000) positions[i+2] *= -0.99;

        // Cursor Repel Math!
        if (activeRaycaster && activeRaycaster.ray) {
            const starVec = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]);
            const distanceToRay = activeRaycaster.ray.distanceSqToPoint(starVec);
            
            // If the star gets within the "danger zone" of the mouse laser
            if (distanceToRay < 20000) { 
                const closestPoint = activeRaycaster.ray.closestPointToPoint(starVec, new THREE.Vector3());
                const repelDir = starVec.sub(closestPoint).normalize();
                
                // Push the star violently away
                positions[i] += repelDir.x * 25;
                positions[i+1] += repelDir.y * 25;
                positions[i+2] += repelDir.z * 25;
            }
        }
    }
    // CRITICAL: Tell the GPU that the stars have moved!
    particlesMesh.geometry.attributes.position.needsUpdate = true;
    
    // Slowly rotate the entire planet system
    if (planetGroup) {
        planetGroup.rotation.y += 0.0005;
        planetGroup.rotation.x += 0.0002;
        planetGroup.children.forEach(p => p.rotation.x -= 0.002); // Spin them on their own axis
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}