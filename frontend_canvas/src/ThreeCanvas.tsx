import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { CSS2DRenderer } from 'three-stdlib';

interface ThreeCanvasProps {
  onCameraUpdate?: (callback: (target: { x: number; y: number; z: number }, zoom: number) => void) => void;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ onCameraUpdate }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const isAnimatingRef = useRef(false);

  const animateCamera = useCallback((target: { x: number; y: number; z: number }, zoom: number) => {
    if (!cameraRef.current || !controlsRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();

    // Calculate camera distance based on zoom level
    let distance;
    if (zoom < 0.5) {
      // Overview mode - closer for better detail visibility
      distance = 5 / zoom;
    } else {
      // Close-up mode
      distance = 15 / zoom;
    }

    // Position camera at an angle for better view
    const angle = Math.PI / 6; // 30 degrees
    const endPosition = new THREE.Vector3(
      target.x + distance * Math.sin(angle),
      target.y + distance * 0.3,
      target.z + distance * Math.cos(angle)
    );
    const endTarget = new THREE.Vector3(target.x, target.y, target.z);
    const duration = 2500; // 2.5 seconds for smoother transitions
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const ease = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate camera position
      camera.position.lerpVectors(startPosition, endPosition, ease);
      
      // Interpolate target
      controls.target.lerpVectors(startTarget, endTarget, ease);
      
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
      }
    };
    
    animate();
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) {
      return;
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark grey background

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 50, 50);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Label Renderer
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    currentMount.appendChild(labelRenderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(100, 10);
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      labelRenderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
      currentMount.removeChild(labelRenderer.domElement);
    };
  }, []);

  // Update camera when requested
  useEffect(() => {
    if (onCameraUpdate) {
      onCameraUpdate(animateCamera);
    }
  }, [animateCamera, onCameraUpdate]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />;
};

export default ThreeCanvas;
