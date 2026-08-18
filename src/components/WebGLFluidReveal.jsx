import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const fragmentShader = `
uniform sampler2D tex1; // white map (default bg)
uniform sampler2D tex2; // colored map (reveal)
uniform vec2 uMouse;
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;

void main() {
  // Correct aspect ratio for a perfect circle
  vec2 aspectUv = vec2(vUv.x * uAspect, vUv.y);
  vec2 aspectMouse = vec2(uMouse.x * uAspect, uMouse.y);
  
  float dist = distance(aspectUv, aspectMouse);
  
  vec2 texUv = vUv;
  
  // Size of the reveal and feathering
  float radius = 0.22; 
  float softness = 0.18; 
  
  // Fluid/water-like noise based on time and position to distort the mask (very minimal)
  float noise = sin(vUv.x * 12.0 + uTime * 1.0) * cos(vUv.y * 12.0 + uTime * 1.0) * 0.005;
  
  // Mask determining where image 2 (colored) is shown
  float distMask = smoothstep(radius + softness, radius - softness, dist + noise);
  
  // Fluidic distortion on the UV coordinates of the revealed image (almost unrecognisable)
  vec2 distortedUv = texUv + vec2(
      sin(texUv.y * 20.0 + uTime * 1.5) * 0.002,
      cos(texUv.x * 20.0 + uTime * 1.5) * 0.002
  ) * distMask;
  
  // Sample textures
  vec4 color1 = texture2D(tex1, texUv);
  
  // Reduce opacity of the default white map (make it faint)
  color1.a *= 0.3; 
  color1.rgb *= 0.3; // Pre-multiply alpha for proper blending in WebGL
  vec4 color2 = texture2D(tex2, distortedUv);
  
  // Reduce opacity of the revealed colored map
  color2.a *= 0.6;
  color2.rgb *= 0.6;
  
  // Blend them using the distorted mask
  gl_FragColor = mix(color1, color2, distMask);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Standard orthographic projection
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ShaderPlane = ({ mouseX, mouseY }) => {
  const meshRef = useRef();
  
  // Load the two textures
  // tex1 is the default map, tex2 is the reveal map
  const [tex1, tex2] = useTexture(['/default.png', '/hover.png']);
  
  const uniforms = useMemo(() => ({
    tex1: { value: tex1 },
    tex2: { value: tex2 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0.0 },
    uAspect: { value: 1.0 }
  }), [tex1, tex2]);

  useFrame((state) => {
    if (meshRef.current) {
      const { size } = state;
      
      // mouseX and mouseY are Framer Motion values tracking global mouse position
      const mX = mouseX ? mouseX.get() : window.innerWidth / 2;
      const mY = mouseY ? mouseY.get() : window.innerHeight / 2;
      
      // Convert pixel coords to UV coords [0, 1]
      // WebGL UVs have Y=0 at bottom, so we invert Y
      const nx = mX / window.innerWidth;
      const ny = 1.0 - (mY / window.innerHeight);
      
      // Smooth interpolation for the mouse could be added here, 
      // but Framer Motion's values are already sprung in App.jsx!
      meshRef.current.material.uniforms.uMouse.value.set(nx, ny);
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      meshRef.current.material.uniforms.uAspect.value = size.width / size.height;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Plane covering exactly the [-1, 1] orthographic view */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function WebGLFluidReveal({ mouseX, mouseY }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas 
        orthographic 
        camera={{ position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1 }}
        gl={{ alpha: true, antialias: false }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Cap pixel ratio for performance
      >
        <React.Suspense fallback={null}>
          <ShaderPlane mouseX={mouseX} mouseY={mouseY} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
