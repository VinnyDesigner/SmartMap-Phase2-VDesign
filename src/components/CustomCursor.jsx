import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import glbUrl from '../assets/map_pointer.glb?url';

function DelicatePinModel() {
  const { scene } = useGLTF(glbUrl);
  const ref = useRef();
  
  // Clone scene to prevent mutation issues with React StrictMode / HMR
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Apply a premium purple metallic material
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#8b5cf6', // DGE Purple Accent
          emissive: '#5b21b6',
          emissiveIntensity: 0.25,
          metalness: 0.85,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.5
        });
      }
    });
  }, [clonedScene]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Delicate continuous rotation (Y-axis)
    const rotateY = time * 0.45;
    
    // 2. Delicate bounce (gentle vertical floating)
    const floatY = Math.sin(time * 1.8) * 0.16;
    
    // 3. Delicate tilt (organic X & Z wobble)
    const tiltX = Math.sin(time * 1.2) * 0.07;
    const tiltZ = Math.cos(time * 1.5) * 0.05;

    // 4. Delicate resize / scale pulsation
    const scalePulse = 0.56 + Math.sin(time * 1.6) * 0.025;

    ref.current.rotation.y = rotateY;
    ref.current.rotation.x = tiltX;
    ref.current.rotation.z = tiltZ;
    ref.current.position.y = -0.2 + floatY;
    ref.current.scale.set(scalePulse, scalePulse, scalePulse);
  });

  return (
    <group ref={ref}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function CustomCursor({ isSearchFocused }) {
  const isTouchDevice = typeof window !== 'undefined' && matchMedia('(hover: none)').matches;
  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed top-[26vh] end-[15vw] md:end-[18vw] lg:end-[20vw] z-30 pointer-events-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isSearchFocused ? 0 : 1, 
        scale: isSearchFocused ? 0.8 : 1 
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="relative flex flex-col items-center justify-center w-[120px] h-[140px] md:w-[140px] md:h-[160px]">
        <Canvas camera={{ position: [0, 2, 8], fov: 40 }} style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
          <ambientLight intensity={1.6} />
          <directionalLight position={[5, 10, 5]} intensity={2.6} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={1.3} color="#c084fc" />
          <React.Suspense fallback={null}>
            <DelicatePinModel />
          </React.Suspense>
        </Canvas>

        {/* Dynamic Ground Shadow synchronized with delicate bounce */}
        <motion.div 
          className="absolute bottom-1 w-12 h-3.5 bg-slate-900/25 dark:bg-purple-900/35 blur-[6px] rounded-[100%]"
          animate={{
            scale: [0.85, 1.15, 0.85],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
}
