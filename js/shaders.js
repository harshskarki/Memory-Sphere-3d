// 📄 js/shaders.js
// Stores the custom WebGL raw strings
export const ShaderChunks = {
    vertexInit: `
        uniform float time;
        uniform float hoverState;
        void main() {
    `,
    vertexFlutter: `
        #include <begin_vertex>
        float wave = sin(position.x * 0.15 + time * 4.0) * cos(position.y * 0.15 + time * 3.0);
        transformed.z += wave * 2.5 * hoverState;
    `,
    fragmentInit: `
        float customRand(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }
        float customNoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f*f*(3.0-2.0*f);
            return mix( mix( customRand( i + vec2(0.0,0.0) ), customRand( i + vec2(1.0,0.0) ), u.x),
                        mix( customRand( i + vec2(0.0,1.0) ), customRand( i + vec2(1.0,1.0) ), u.x), u.y);
        }
        void main() {
    `,
    fragmentTear: `
        #include <dithering_fragment>
        float edgeDistX = min(vUv.x, 1.0 - vUv.x);
        float edgeDistY = min(vUv.y, 1.0 - vUv.y);
        float edgeDist = min(edgeDistX, edgeDistY);
        float n = customNoise(vUv * 40.0) * 0.6 + customNoise(vUv * 120.0) * 0.3;
        
        if (edgeDist < 0.015 + n * 0.04) {
            discard;
        }
    `
};