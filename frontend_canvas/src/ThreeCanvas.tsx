import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { CSS2DRenderer, CSS2DObject } from 'three-stdlib';

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
    scene.background = new THREE.Color(0x000011);

    // Camera - Closer view for better detail while keeping full system visible
    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 3000);
    camera.position.set(0, 50, 120); // Closer position for more zoom
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

    // Controls - Enhanced for better interaction
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 500; // Much larger range for wide views
    controls.target.set(0, 0, 0); // Focus on the center (Sun)
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 8, 300);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Enhanced Sun with glow effect
    const sunGeometry = new THREE.SphereGeometry(2, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load('textures/2k_sun.jpg', undefined, undefined, (err: any) => {
        console.error('An error occurred while loading the sun texture.', err);
      }),
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Sun glow effect
    const glowGeometry = new THREE.SphereGeometry(2.1, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(sunGlow);

    // Sun label
    const sunLabelDiv = document.createElement('div');
    sunLabelDiv.className = 'planet-label sun-label';
    sunLabelDiv.textContent = 'Sun ☀️';
    const sunLabel = new CSS2DObject(sunLabelDiv);
    sunLabel.position.set(0, 2.5, 0);
    sun.add(sunLabel);

    const createPlanet = (name: string, radius: number, textureUrl: string, distance: number, revolutionSpeed: number, rotationSpeed: number) => {
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(`textures/${textureUrl}`, undefined, undefined, (err: any) => {
          console.error(`An error occurred while loading the ${name} texture.`, err);
        }),
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = distance;

      const planetObject = new THREE.Object3D();
      planetObject.add(planet);
      scene.add(planetObject);

      // Label
      const planetDiv = document.createElement('div');
      planetDiv.className = 'planet-label';
      planetDiv.textContent = name;
      const planetLabel = new CSS2DObject(planetDiv);
      planetLabel.position.set(0, radius + 0.2, 0);
      planet.add(planetLabel);
      
      // Orbit - Highly visible orbital paths like in the reference image
      const orbitGeometry = new THREE.RingGeometry(distance - 0.03, distance + 0.03, 256);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x888888, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.8 
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = -Math.PI / 2;
      scene.add(orbit);

      return { planet, planetObject, revolutionSpeed, rotationSpeed };
    };
    
    const planets = [
        createPlanet('Mercury', 0.3, '2k_mercury.jpg', 4, 0.04, 0.004),
        createPlanet('Venus', 0.5, '2k_venus_surface.jpg', 7, 0.015, 0.002),
        createPlanet('Earth', 0.6, '2k_earth_daymap.jpg', 10, 0.01, 0.02),
        createPlanet('Mars', 0.4, '2k_mars.jpg', 14, 0.008, 0.018),
        createPlanet('Jupiter', 1.2, '2k_jupiter.jpg', 20, 0.002, 0.04),
        createPlanet('Saturn', 1, '2k_saturn.jpg', 28, 0.0009, 0.038),
        createPlanet('Uranus', 0.7, '2k_uranus.jpg', 36, 0.0004, 0.03),
        createPlanet('Neptune', 0.7, '2k_neptune.jpg', 44, 0.0001, 0.032),
    ];

    // Saturn's Ring
    const saturn = planets[5];
    const ringGeometry = new THREE.RingGeometry(1.2, 2, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('textures/2k_saturn_ring_alpha.png', undefined, undefined, (err: any) => {
          console.error('An error occurred while loading the saturn ring texture.', err);
        }),
        side: THREE.DoubleSide,
        transparent: true,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI * 0.4;
    saturn.planet.add(ring);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Enhanced sun rotation with slight wobble
      sun.rotation.y += 0.002;
      sunGlow.rotation.y -= 0.001;
      sunGlow.rotation.x += 0.0005;

      planets.forEach((p: any) => {
        p.planet.rotation.y += p.rotationSpeed;
        p.planetObject.rotation.y += p.revolutionSpeed;
      });

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

    // Enhanced mouse controls for zoom-to-pointer
    const mouse = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // Improve orbit controls behavior
    controls.addEventListener('change', () => {
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
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
