import React, { useState, useEffect } from 'react';
import './InfoPanel.css';

interface InfoPanelProps {
  onCameraUpdate?: (target: { x: number; y: number; z: number }, zoom: number) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ onCameraUpdate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const explorationSteps = [
    {
      title: "Welcome to Our Solar System",
      content: [
        "• Our solar system formed 4.6 billion years ago",
        "• Contains 8 planets orbiting our central star, the Sun",
        "• Extends over 100,000 astronomical units in diameter", 
        "• Home to countless asteroids, comets, and moons",
        "• Each planet has unique characteristics and mysteries"
      ],
      action: "Viewing the complete solar system overview...",
      target: { x: 0, y: 0, z: 0 },
      zoom: 0.12,
      planetImage: null
    },
    {
      title: "The Sun - Our Life-Giving Star",
      content: [
        "• Mass: 99.86% of the entire solar system's mass",
        "• Core Temperature: 15 million°C (27 million°F)",
        "• Surface Temperature: 5,500°C (9,900°F)", 
        "• Composition: 73% Hydrogen, 25% Helium",
        "• Powers all life on Earth through nuclear fusion"
      ],
      action: "Focusing on our magnificent star...",
      target: { x: 0, y: 0, z: 0 },
      zoom: 2.0,
      planetImage: "textures/2k_sun.jpg",
      planetName: "The Sun ☀️"
    },
    {
      title: "Mercury - The Swift Planet",
      content: [
        "• Closest planet to the Sun (0.39 AU)",
        "• Smallest planet in our solar system",
        "• Day length: 59 Earth days",
        "• Temperature: -173°C to 427°C extreme variations",
        "• No atmosphere, heavily cratered surface"
      ],
      action: "Zooming to Mercury, the speed demon...",
      target: { x: 4, y: 0, z: 0 },
      zoom: 3.0,
      planetImage: "textures/2k_mercury.jpg",
      planetName: "Mercury"
    },
    {
      title: "Venus - The Greenhouse World",
      content: [
        "• Hottest planet in solar system (462°C surface)",
        "• Thick, toxic atmosphere of carbon dioxide",
        "• Atmospheric pressure: 90x stronger than Earth",
        "• Rotates backwards (retrograde rotation)",
        "• Shrouded in thick clouds of sulfuric acid"
      ],
      action: "Approaching Venus, our 'evil twin'...",
      target: { x: 7, y: 0, z: 0 },
      zoom: 2.5,
      planetImage: "textures/2k_venus_surface.jpg",
      planetName: "Venus"
    },
    {
      title: "Earth - Our Blue Marble",
      content: [
        "• Only known planet with life in the universe",
        "• 71% of surface covered by liquid water",
        "• Protective magnetic field and atmosphere",
        "• One natural satellite: the Moon",
        "• Perfect distance from Sun for life (Goldilocks zone)"
      ],
      action: "Visiting our beautiful home planet...",
      target: { x: 10, y: 0, z: 0 },
      zoom: 2.2,
      planetImage: "textures/2k_earth_daymap.jpg",
      planetName: "Earth 🌍"
    },
    {
      title: "Mars - The Red Planet",
      content: [
        "• Rusty red color from iron oxide (rust)",
        "• Largest volcano in solar system: Olympus Mons",
        "• Evidence of ancient water flows and possible life",
        "• Two small moons: Phobos and Deimos",
        "• Day length similar to Earth (24.6 hours)"
      ],
      action: "Exploring the red desert world...",
      target: { x: 14, y: 0, z: 0 },
      zoom: 2.8,
      planetImage: "textures/2k_mars.jpg",
      planetName: "Mars"
    },
    {
      title: "Jupiter - The Gas Giant King",
      content: [
        "• Largest planet: could fit 1,300+ Earths inside",
        "• Great Red Spot: storm larger than Earth",
        "• 95+ known moons, including 4 large Galilean moons",
        "• Mostly hydrogen and helium gas",
        "• Acts as 'vacuum cleaner' protecting inner planets"
      ],
      action: "Marveling at the giant of our solar system...",
      target: { x: 20, y: 0, z: 0 },
      zoom: 1.0,
      planetImage: "textures/2k_jupiter.jpg",
      planetName: "Jupiter"
    },
    {
      title: "Saturn - The Ringed Beauty",
      content: [
        "• Famous for spectacular ring system",
        "• Rings made of ice particles and rocky debris",
        "• Less dense than water - would float!",
        "• 140+ moons, including cloud-covered Titan",
        "• Hexagonal storm at north pole"
      ],
      action: "Admiring the jewel of the solar system...",
      target: { x: 28, y: 0, z: 0 },
      zoom: 0.8,
      planetImage: "textures/2k_saturn.jpg",
      planetName: "Saturn"
    },
    {
      title: "Uranus - The Sideways Ice Giant",
      content: [
        "• Rotates on its side (98° axial tilt)",
        "• Made of water, methane, and ammonia ices",
        "• Faint ring system discovered in 1977",
        "• 27 known moons named after Shakespeare characters",
        "• Coldest planetary atmosphere (-224°C)"
      ],
      action: "Observing the tilted ice world...",
      target: { x: 36, y: 0, z: 0 },
      zoom: 1.2,
      planetImage: "textures/2k_uranus.jpg",
      planetName: "Uranus"
    },
    {
      title: "Neptune - The Windy Blue Giant",
      content: [
        "• Windiest planet: speeds up to 2,100 km/h",
        "• Deep blue color from methane in atmosphere",
        "• Takes 165 Earth years to orbit the Sun",
        "• 16 known moons, largest is Triton",
        "• Farthest known planet from the Sun"
      ],
      action: "Completing our tour at the edge of our solar system...",
      target: { x: 44, y: 0, z: 0 },
      zoom: 1.4,
      planetImage: "textures/2k_neptune.jpg",
      planetName: "Neptune"
    },
    {
      title: "Solar System Complete Tour",
      content: [
        "• Journey complete: 8 unique worlds explored",
        "• Each planet tells a story of formation and evolution",
        "• From scorching Venus to frozen Neptune",
        "• Our solar system: a cosmic neighborhood full of wonders",
        "• Use controls to explore further on your own!"
      ],
      action: "Returning to full solar system view...",
      target: { x: 0, y: 0, z: 0 },
      zoom: 0.13,
      planetImage: null
    }
  ];

  useEffect(() => {
    let interval: number;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= explorationSteps.length) {
            setIsAutoPlay(false);
            return 0; // Reset to beginning
          }
          return nextStep;
        });
      }, 5000); // 5 seconds per step for more detailed content
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, explorationSteps.length]);

  useEffect(() => {
    if (onCameraUpdate && explorationSteps[currentStep]) {
      const step = explorationSteps[currentStep];
      onCameraUpdate(step.target, step.zoom);
    }
  }, [currentStep, onCameraUpdate, explorationSteps]);

  const currentStepData = explorationSteps[currentStep];

  const handleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
    if (!isAutoPlay) {
      setCurrentStep(0);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(explorationSteps.length - 1, prev + 1));
  };

  return (
    <div className="info-panel">
      <div className="step-counter">
        Step {currentStep + 1} of {explorationSteps.length}
        {isAutoPlay && <span className="auto-indicator">🔄 AUTO</span>}
      </div>
      
      <h2>{currentStepData.title}</h2>
      
      {/* Planet Image Card */}
      {currentStepData.planetImage && (
        <div className="planet-card">
          <img 
            src={currentStepData.planetImage} 
            alt={currentStepData.planetName}
            className="planet-image"
          />
          <div className="planet-name">{currentStepData.planetName}</div>
        </div>
      )}
      
      <div className="content">
        {Array.isArray(currentStepData.content) ? (
          <ul>
            {currentStepData.content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{currentStepData.content}</p>
        )}
      </div>
      
      <div className="action-text">
        <em>{currentStepData.action}</em>
      </div>
      
      <div className="controls">
        <button 
          onClick={handlePrevStep} 
          disabled={currentStep === 0}
          className="nav-button"
        >
          ← Prev
        </button>
        
        <button 
          onClick={handleAutoPlay}
          className={`auto-button ${isAutoPlay ? 'active' : ''}`}
        >
          {isAutoPlay ? '⏸ Pause' : '▶ Auto Explore'}
        </button>
        
        <button 
          onClick={handleNextStep} 
          disabled={currentStep === explorationSteps.length - 1}
          className="nav-button"
        >
          Next →
        </button>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentStep + 1) / explorationSteps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default InfoPanel;
