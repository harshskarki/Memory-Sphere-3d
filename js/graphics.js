// 📄 js/graphics.js
// Handles all 2D Canvas texture generation logic
import * as THREE from 'three';
import { renderer } from './engine.js';

export function createUserImageTexture(img, index) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, size, size);

    const margin = 35;
    const imgSize = size - (margin * 2);
    const scale = Math.max(imgSize / img.width, imgSize / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = margin + (imgSize / 2) - (w / 2);
    const y = margin + (imgSize / 2) - (h / 2);
    
    ctx.save();
    ctx.beginPath();
    ctx.rect(margin, margin, imgSize, imgSize);
    ctx.clip(); 
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    ctx.strokeStyle = '#1e293b'; 
    ctx.lineWidth = 5;
    for(let i = 0; i < 3; i++) {
        ctx.beginPath();
        const m = margin - 10 + Math.random() * 8;
        ctx.moveTo(m, m);
        ctx.lineTo(size - m - Math.random() * 15, m + Math.random() * 8);
        ctx.lineTo(size - m, size - m - Math.random() * 15);
        ctx.lineTo(m + Math.random() * 15, size - m);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(size/2 - 50, 5, 100, 30);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.strokeRect(size/2 - 50, 5, 100, 30);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
}

export function createProceduralTexture(index) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 5;
    
    for(let i = 0; i < 3; i++) {
        ctx.beginPath();
        const margin = 20 + Math.random() * 8;
        ctx.moveTo(margin, margin);
        ctx.lineTo(size - margin - Math.random() * 15, margin + Math.random() * 8);
        ctx.lineTo(size - margin, size - margin - Math.random() * 15);
        ctx.lineTo(margin + Math.random() * 15, size - margin);
        ctx.closePath();
        ctx.stroke();
    }

    const colors = ['#2dd4bf', '#fb923c', '#f87171']; 
    const themeColor = colors[index % colors.length];
    
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.ellipse(size/2, size/2 - 30, 110 + Math.random()*20, 90 + Math.random()*20, Math.random()*Math.PI, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 85px "Caveat", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Memory ${index + 1}`, size / 2, size / 2 - 25);
    
    ctx.font = 'bold 35px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    const locations = ['Maharashtra', 'Rajasthan', 'Kerala', 'Uttarakhand', 'Goa'];
    
    ctx.fillText(locations[index % locations.length].toUpperCase(), size / 2, size / 2 + 35);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); 
    return texture;
}