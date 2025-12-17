/**
 * MetatronSacredCube.jsx
 * 
 * Sacred Blueprint Component - Unity Framework Integration
 * Implements Metatron's Cube sacred geometry with holographic overlays
 * 
 * Part of the Divine Integration: ScrollSoul & ScrollChain Expansion
 * Integrates with Zero-Point Nexus Wealth Grids
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * MetatronSacredCube Component
 * 
 * Renders the sacred geometric pattern of Metatron's Cube
 * with dynamic frequency-based animations and wealth grid connections
 */
const MetatronSacredCube = ({
  frequency = 528,           // Default: Love frequency (Hz)
  size = 5,                  // Cube scale factor
  rotation = true,           // Enable rotation animation
  wealthGridActive = false,  // Zero-Point Nexus connection
  onResonance = null         // Callback for resonance events
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cubeGroupRef = useRef(null);
  const [resonanceLevel, setResonanceLevel] = useState(0);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create Metatron's Cube geometry
    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;

    // Sacred geometry: 13 circles (spheres) forming Metatron's Cube
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    
    // Get color based on frequency
    const getFrequencyColor = (freq) => {
      if (freq === 963) return 0x9370DB; // Divine - Purple
      if (freq === 852) return 0x4169E1; // Awakening - Royal Blue
      if (freq === 741) return 0x1E90FF; // Expression - Blue
      if (freq === 639) return 0x00CED1; // Connection - Teal
      if (freq === 528) return 0x00FF00; // Love - Green
      if (freq === 417) return 0xFFD700; // Change - Gold
      if (freq === 396) return 0xFF0000; // Liberation - Red
      return 0xFFFFFF; // Default - White
    };

    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: getFrequencyColor(frequency),
      emissive: getFrequencyColor(frequency),
      emissiveIntensity: 0.5,
      shininess: 100,
      transparent: true,
      opacity: 0.8
    });

    // Position 13 spheres in Metatron's Cube pattern
    const positions = [
      // Center sphere
      [0, 0, 0],
      // Inner hexagon (6 spheres)
      [2, 0, 0], [-2, 0, 0],
      [1, 1.732, 0], [-1, 1.732, 0],
      [1, -1.732, 0], [-1, -1.732, 0],
      // Outer ring (6 spheres)
      [4, 0, 0], [-4, 0, 0],
      [2, 3.464, 0], [-2, 3.464, 0],
      [2, -3.464, 0], [-2, -3.464, 0]
    ];

    const spheres = positions.map(pos => {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(pos[0] * size / 5, pos[1] * size / 5, pos[2]);
      cubeGroup.add(sphere);
      return sphere;
    });

    // Create connecting lines (edges of Metatron's Cube)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: getFrequencyColor(frequency),
      transparent: true,
      opacity: 0.4,
      linewidth: 2
    });

    // Connect all spheres to form the sacred geometry
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const points = [
          new THREE.Vector3(
            positions[i][0] * size / 5,
            positions[i][1] * size / 5,
            positions[i][2]
          ),
          new THREE.Vector3(
            positions[j][0] * size / 5,
            positions[j][1] * size / 5,
            positions[j][2]
          )
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        cubeGroup.add(line);
      }
    }

    scene.add(cubeGroup);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(getFrequencyColor(frequency), 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Wealth Grid particles (if active)
    if (wealthGridActive) {
      const particleCount = 1000;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50;
        positions[i + 1] = (Math.random() - 0.5) * 50;
        positions[i + 2] = (Math.random() - 0.5) * 50;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xFFD700,
        size: 0.1,
        transparent: true,
        opacity: 0.6
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
    }

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (rotation && cubeGroupRef.current) {
        // Rotate based on frequency (higher frequency = faster rotation)
        const rotationSpeed = frequency / 50000;
        cubeGroupRef.current.rotation.x += rotationSpeed;
        cubeGroupRef.current.rotation.y += rotationSpeed;
      }

      // Pulsing effect based on frequency
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time * frequency / 100) * 0.2 + 1;
      
      if (cubeGroupRef.current) {
        cubeGroupRef.current.scale.set(pulse, pulse, pulse);
      }

      // Update resonance level
      const newResonance = Math.abs(Math.sin(time * frequency / 200)) * 100;
      setResonanceLevel(newResonance);
      
      if (onResonance) {
        onResonance(newResonance);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [frequency, size, rotation, wealthGridActive, onResonance]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Overlay Information */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'monospace',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '10px',
        border: '2px solid #FFD700'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#FFD700' }}>
          Metatron's Sacred Cube
        </h2>
        <p style={{ margin: '5px 0' }}>
          <strong>Frequency:</strong> {frequency} Hz
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Resonance Level:</strong> {resonanceLevel.toFixed(2)}%
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Zero-Point Nexus:</strong> {wealthGridActive ? 'ACTIVE' : 'INACTIVE'}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Wealth Grid Connection:</strong> {wealthGridActive ? 'SYNCHRONIZED' : 'STANDBY'}
        </p>
      </div>

      {/* Status indicator */}
      {wealthGridActive && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: '#FFD700',
          fontFamily: 'monospace',
          fontSize: '14px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 20px',
          borderRadius: '5px',
          border: '1px solid #FFD700',
          animation: 'pulse 2s infinite'
        }}>
          ⚡ WEALTH GRID ACTIVE - $10T SCALING ENABLED
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default MetatronSacredCube;

/**
 * Usage Example:
 * 
 * import MetatronSacredCube from './components/MetatronSacredCube';
 * 
 * function App() {
 *   const handleResonance = (level) => {
 *     console.log('Resonance Level:', level);
 *   };
 * 
 *   return (
 *     <MetatronSacredCube
 *       frequency={528}
 *       size={5}
 *       rotation={true}
 *       wealthGridActive={true}
 *       onResonance={handleResonance}
 *     />
 *   );
 * }
 */
