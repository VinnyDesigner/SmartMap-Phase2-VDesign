import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import glbUrl from '../assets/map_pointer.glb?url';

// 2D Canvas Particle System for Kinetic Disintegration Trail
const ParticleTrail = ({ cursorX, cursorY, isVisible }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let lastX = cursorX.get();
    let lastY = cursorY.get();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isVisible) {
        particles = [];
        lastX = cursorX.get();
        lastY = cursorY.get();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const currentX = cursorX.get();
      const currentY = cursorY.get();
      const vx = currentX - lastX;
      const vy = currentY - lastY;
      const speed = Math.sqrt(vx * vx + vy * vy);
      
      // Emit particles based on kinetic speed
      if (speed > 2) {
        const emitCount = Math.min(Math.floor(speed * 0.8), 15); // Emit slightly more since they are tiny
        for(let i=0; i<emitCount; i++) {
          particles.push({
            x: currentX + (Math.random() - 0.5) * 12, // Tighter scatter around pin body
            y: currentY - 40 + (Math.random() - 0.5) * 24, // Offset to pin vertical center
            vx: -vx * 0.12 + (Math.random() - 0.5) * 2, // Slightly slower kinetic backward scatter
            vy: -vy * 0.12 + (Math.random() - 0.5) * 2,
            life: 1.0,
            decay: 0.03 + Math.random() * 0.04, // Fade a bit faster
            size: Math.random() * 1.2 + 0.3 // Very tiny particles (0.3px to 1.5px)
          });
        }
      }
      
      lastX = currentX;
      lastY = currentY;

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay; 
        
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 63, 67, ${p.life})`; // DGE Brand Red metallic hue
          ctx.shadowBlur = 3;
          ctx.shadowColor = `rgba(239, 63, 67, ${p.life * 0.8})`;
          ctx.fill();
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorX, cursorY, isVisible]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />;
};

function PinModel({ cursorX, cursorY }) {
  const { scene } = useGLTF(glbUrl);
  const ref = useRef();
  
  // Clone the object to prevent mutation issues with React StrictMode / HMR
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Apply a premium red metallic material
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#ef3f43', // Custom Red
          emissive: '#8a1f23',
          emissiveIntensity: 0.2,
          metalness: 0.8,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.5
        });
      }
    });
  }, [clonedScene]);

  // Keep track of previous position to calculate velocity
  const prevPos = useRef({ x: cursorX.get(), y: cursorY.get() });
  
  // State for dynamic spinning
  const spinVelocity = useRef(0);
  const currentSpin = useRef(0);

  useFrame(() => {
    if (!ref.current) return;

    const currentX = cursorX.get();
    const currentY = cursorY.get();
    
    // Calculate velocity (difference between current and previous frame)
    const vx = currentX - prevPos.current.x;
    const vy = currentY - prevPos.current.y;
    
    prevPos.current.x = currentX;
    prevPos.current.y = currentY;

    // Calculate speed of mouse movement
    const speed = Math.sqrt(vx * vx + vy * vy);
    
    // 1. CLEVER SPIN: Add speed to spin velocity and apply friction
    // The faster you move, the faster it spins. It smoothly slows down when you stop.
    spinVelocity.current += speed * 0.008; 
    spinVelocity.current *= 0.92; // Friction
    currentSpin.current += spinVelocity.current;

    // 2. IDLE ANIMATION: Breathing / floating and slow rotation
    const time = performance.now() * 0.002;
    const idleRotation = time * 0.3; // Slow continuous spin
    const floatY = Math.sin(time * 1.5) * 0.15; // Gentle up and down breathing
    
    // 3. TILT: Still tilt slightly based on direction of movement for physical feel
    const maxTilt = 0.5;
    const targetRotationX = THREE.MathUtils.clamp(vy * 0.04, -maxTilt, maxTilt);
    const targetRotationZ = THREE.MathUtils.clamp(-vx * 0.04, -maxTilt, maxTilt);

    // Apply combined rotations
    ref.current.rotation.y = idleRotation + currentSpin.current;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotationX, 0.15);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRotationZ, 0.15);

    // Apply floating position (shifted up to prevent bottom cropping)
    ref.current.position.y = -0.2 + floatY;
  });

  return (
    <group ref={ref}>
      <primitive object={clonedScene} scale={0.56} />
    </group>
  );
}

export default function CustomCursor({ mouseX, mouseY, isSearchFocused, isHoveringSearch }) {
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 800 });
  const [locationName, setLocationName] = useState("ABU DHABI");

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Premium spring physics for smooth inertia
  const springConfig = { damping: 28, stiffness: 200, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // Calculate location based on viewport percentage for simulated map areas
  useEffect(() => {
    const unsubscribe = mouseX.on("change", (xVal) => {
      const yVal = mouseY.get();
      const pctX = xVal / windowSize.w;
      const pctY = yVal / windowSize.h;
      
      let newLocation = "ABU DHABI";
      if (pctY < 0.4 && pctX > 0.6) newLocation = "SAADIYAT ISLAND";
      else if (pctY > 0.6 && pctX > 0.6) newLocation = "KHALIFA CITY";
      else if (pctX < 0.4 && pctY < 0.5) newLocation = "CORNICHE";
      else if (pctX > 0.4 && pctX < 0.6 && pctY < 0.4) newLocation = "YAS ISLAND";
      else if (pctX > 0.4 && pctX < 0.6 && pctY >= 0.4 && pctY < 0.6) newLocation = "AL REEM ISLAND";
      else if (pctY > 0.5 && pctX < 0.6) newLocation = "ABU DHABI ISLAND";
      else newLocation = "ZAYED CITY";

      if (newLocation !== locationName) {
        setLocationName(newLocation);
      }
    });
    return unsubscribe;
  }, [mouseX, mouseY, windowSize, locationName]);

  // Hide custom cursor on mobile or when search is focused/hovered
  const isTouchDevice = typeof window !== 'undefined' && matchMedia('(hover: none)').matches;
  if (isTouchDevice) return null;

  return (
    <>
      <ParticleTrail 
        cursorX={cursorX} 
        cursorY={cursorY} 
        isVisible={!(isSearchFocused || isHoveringSearch)} 
      />
      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: (isSearchFocused || isHoveringSearch) ? 0 : 1, 
        }}
        initial={false}
        animate={{ opacity: (isSearchFocused || isHoveringSearch) ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
      {/* 3D Map Pointer using React Three Fiber */}
      <div className="relative -left-[60px] -top-[100px]" style={{ width: 120, height: 120 }}>
        {/* Subtle glass shadow underneath the 3D pin to anchor it */}
        <div className="absolute bottom-[0px] left-[35px] w-12 h-4 bg-slate-900/20 blur-[8px] rounded-[100%] -z-10" />
        
        <Canvas camera={{ position: [0, 2, 8], fov: 40 }} style={{ pointerEvents: 'none' }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={1} color="#60a5fa" />
          <React.Suspense fallback={null}>
            <PinModel cursorX={cursorX} cursorY={cursorY} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Floating Location Tooltip */}
      <motion.div 
        className="absolute top-8 left-12 whitespace-nowrap bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-xl py-2 px-3.5"
        layout
      >
        <motion.p 
          key={locationName}
          initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-[11px] font-bold text-dge-tech tracking-[0.2em] uppercase"
        >
          {locationName}
        </motion.p>
        <p className="text-[10px] text-dge-grey font-semibold uppercase tracking-[0.15em] mt-0.5">
          Abu Dhabi
        </p>
      </motion.div>
    </motion.div>
    </>
  );
}
