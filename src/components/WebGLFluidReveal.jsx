import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const fragmentShader = `
uniform sampler2D tex1; // white map (default bg)
uniform sampler2D tex2; // colored map (reveal)
uniform float uIsDark;
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
  
  if (uIsDark > 0.5) {
    color1.a *= 1.0;
    color1.rgb *= 1.0;
  } else {
    // Reduce opacity of the default white map (make it faint)
    color1.a *= 0.3; 
    color1.rgb *= 0.3; // Pre-multiply alpha for proper blending in WebGL
  }

  vec4 color2 = texture2D(tex2, distortedUv);
  
  if (uIsDark > 0.5) {
    color2.a *= 0.8;
    color2.rgb *= 0.8;
  } else {
    // Reduce opacity of the revealed colored map
    color2.a *= 0.6;
    color2.rgb *= 0.6;
  }
  
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

const ShaderPlane = ({ mouseX, mouseY, isDarkMode }) => {
  const meshRef = useRef();
  
  const baseUrl = import.meta.env.BASE_URL || './';
  const [texLight, texDark, texHoverLight, texHoverDark] = useTexture([
    `${baseUrl}default.png`, 
    `${baseUrl}default-dark.png`,
    `${baseUrl}hover.png`,
    `${baseUrl}hover-dark.png`
  ]);
  
  const uniforms = useMemo(() => ({
    tex1: { value: isDarkMode ? texDark : texLight },
    tex2: { value: isDarkMode ? texHoverDark : texHoverLight },
    uIsDark: { value: isDarkMode ? 1.0 : 0.0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0.0 },
    uAspect: { value: 1.0 }
  }), [texLight, texDark, texHoverLight, texHoverDark, isDarkMode]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.tex1.value = isDarkMode ? texDark : texLight;
      meshRef.current.material.uniforms.tex2.value = isDarkMode ? texHoverDark : texHoverLight;
      meshRef.current.material.uniforms.uIsDark.value = isDarkMode ? 1.0 : 0.0;
    }
  }, [isDarkMode, texLight, texDark, texHoverLight, texHoverDark]);

  useFrame((state) => {
    if (meshRef.current) {
      const { size } = state;
      
      const mX = mouseX ? mouseX.get() : window.innerWidth / 2;
      const mY = mouseY ? mouseY.get() : window.innerHeight / 2;
      
      const nx = mX / window.innerWidth;
      const ny = 1.0 - (mY / window.innerHeight);
      
      meshRef.current.material.uniforms.uMouse.value.set(nx, ny);
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      meshRef.current.material.uniforms.uAspect.value = size.width / size.height;
    }
  });

  return (
    <mesh ref={meshRef}>
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

export default function WebGLFluidReveal({ mouseX, mouseY, isDarkMode }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas 
        orthographic 
        camera={{ position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1 }}
        gl={{ alpha: true, antialias: false }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <React.Suspense fallback={null}>
          <ShaderPlane mouseX={mouseX} mouseY={mouseY} isDarkMode={isDarkMode} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
