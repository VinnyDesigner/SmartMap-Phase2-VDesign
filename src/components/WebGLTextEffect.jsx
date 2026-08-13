import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, MeshDistortMaterial, Float, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedText = () => {
  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
      <Center position={[0, 0, 0]}>
        <Text
          fontSize={1.6}
          letterSpacing={-0.05}
          position={[-2.4, 0, 0]}
        >
          Find. Explore.
          <meshStandardMaterial metalness={0.6} roughness={0.2} color="#00315a" />
        </Text>
        
        <Text
          fontSize={1.6}
          letterSpacing={-0.05}
          position={[2.3, 0, 0]}
        >
          Understand.
          <MeshDistortMaterial 
            color="#007398" 
            distort={0.4} 
            speed={2} 
            metalness={0.9} 
            roughness={0.1} 
            envMapIntensity={2.5}
          />
        </Text>
      </Center>
    </Float>
  );
};

export default function WebGLTextEffect() {
  return (
    <div className="w-full h-[120px] relative pointer-events-none mb-2 mt-2">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }} className="w-full h-full" style={{ pointerEvents: 'none' }} dpr={[1, 2]}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -5, 5]} intensity={1} color="#007398" />
        <Environment preset="city" />
        <AnimatedText />
      </Canvas>
    </div>
  );
}
