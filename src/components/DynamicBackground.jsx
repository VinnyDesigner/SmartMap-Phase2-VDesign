import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Terrain = () => {
  const meshRef = useRef();
  const pointsRef = useRef();
  
  // Create a large plane geometry for the topography
  const geometry = useMemo(() => {
    // width, height, widthSegments, heightSegments
    const geo = new THREE.PlaneGeometry(120, 120, 80, 80);
    // Rotate to lay flat on the XZ plane
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      // Complex wave math for natural, silky rolling hills
      const dx = x * 0.03;
      const dz = z * 0.03;
      const y = Math.sin(dx + time * 0.4) * Math.cos(dz + time * 0.3) * 2.5 
              + Math.sin(dx * 1.5 - time * 0.6) * 1.0
              + Math.cos(dz * 1.5 + time * 0.5) * 1.0;
              
      positions.setY(i, y); 
    }
    
    // Notify Three.js that vertices have changed
    positions.needsUpdate = true;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[0, -10, -20]}>
      {/* Wireframe Mesh for the glowing lines */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial 
          color="#3D52A0" 
          wireframe={true} 
          transparent={true} 
          opacity={0.15} 
        />
      </mesh>
      
      {/* Points overlay for the premium "data nodes" look */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial 
          color="#00e5ff" 
          size={0.12}
          transparent={true}
          opacity={0.7}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};

const CameraRig = () => {
  const { camera, pointer } = useThree();
  
  useFrame(() => {
    // Smooth, silky camera movement based on mouse position
    // Base position is y=5, z=20. We shift it based on mouse.
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 8 + pointer.y * 3, 0.02);
    camera.lookAt(0, -5, -20);
  });
  
  return null;
}

export default function DynamicBackground() {
  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden mix-blend-multiply">
      {/* Soft gradient fade at the top to blend with the white header smoothly */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f8fafc] to-transparent z-10 pointer-events-none" />
      
      <Canvas 
        style={{ pointerEvents: 'none' }}
        camera={{ position: [0, 8, 20], fov: 60 }}
        dpr={[1, 2]} // High DPI for crisp rendering
        gl={{ alpha: true, antialias: true }}
      >
        <fog attach="fog" args={['#f8fafc', 10, 80]} />
        <CameraRig />
        <Terrain />
      </Canvas>
      
      {/* Soft gradient fade at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f8fafc] to-transparent z-10 pointer-events-none" />
    </div>
  );
}
