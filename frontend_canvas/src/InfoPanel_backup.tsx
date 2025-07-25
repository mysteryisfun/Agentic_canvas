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
      title: "🌟 Welcome to Our Amazing Solar System!",
      content: [
        "Hi there, space explorers! 👋",
        "Today we're going on the BEST space adventure EVER!",
        "🚀 We'll visit 8 incredible planets",
        "🌞 Learn about our amazing Sun",
        "🌙 Discover cool facts about space",
        "Ready? Let's blast off! 3... 2... 1... 🚀"
      ],
      action: "Getting ready for our space adventure...",
      target: { x: 0, y: 0, z: 0 },
      zoom: 0.08,
      planetImage: null,
      funFact: "Did you know? You could fit over 1 million Earths inside the Sun!",
      kidQuestion: "What do you think keeps the planets spinning around the Sun?"
    },
    {
      title: "☀️ The Sun - Our Neighborhood Star!",
      content: [
        "🌟 The Sun is like a GIANT light bulb in space!",
        "🔥 It's SO hot - 27 MILLION degrees in the center!",
        "⚡ It makes electricity called 'solar power'",
        "🌍 Without it, Earth would be a frozen ice ball!",
        "🏀 Imagine 109 Earths lined up - that's how wide the Sun is!"
      ],
      action: "Zooming in to see our amazing star...",
      target: { x: 0, y: 0, z: 0 },
      zoom: 2.0,
      planetImage: "textures/2k_sun.jpg",
      planetName: "The Sun ☀️",
      funFact: "The Sun is so bright, it would take 8 minutes for its light to reach Earth!",
      kidQuestion: "If the Sun is like a light bulb, what do you think it's made of?",
      animation2D: "sunRays"
    },
    {
      title: "☄️ Mercury - The Speed Racer Planet!",
      content: [
        "🏃‍♂️ Mercury is the FASTEST planet - zooom!",
        "🔥❄️ Super hot in the day, freezing cold at night!",
        "🌕 It looks like our Moon with lots of holes (craters)",
        "⏰ One day on Mercury = 59 Earth days! (Very long!)",
        "🚀 If you could drive a car there, it would melt!"
      ],
      action: "Racing to the speedy little planet...",
      target: { x: 4, y: 0, z: 0 },
      zoom: 3.5,
      planetImage: "textures/2k_mercury.jpg",
      planetName: "Mercury 🏃‍♂️",
      funFact: "Mercury spins around the Sun faster than any other planet!",
      kidQuestion: "Why do you think Mercury has no air to breathe?",
      animation2D: "speedLines"
    },
    {
      title: "♀️ Venus - The Hot Troublemaker!",
      content: [
        "🔥 Venus is the HOTTEST planet - even hotter than Mercury!",
        "☁️ It's covered in thick, yucky clouds",
        "🌪️ It spins backwards! (Very weird!)",
        "🌧️ Instead of water rain, it rains acid! Yuck!",
        "🌟 It's the brightest planet we can see from Earth"
      ],
      action: "Visiting the backwards-spinning hothead...",
      target: { x: 7, y: 0, z: 0 },
      zoom: 2.8,
      planetImage: "textures/2k_venus_surface.jpg",
      planetName: "Venus ♀️",
      funFact: "Venus is so hot, it could melt a penny in seconds!",
      kidQuestion: "Why do you think Venus spins the wrong way?",
      animation2D: "backwardsSpin"
    },
    {
      title: "🌍 Earth - Our Beautiful Home!",
      content: [
        "🏠 This is OUR planet - the most special one!",
        "💧 It's the only planet with water for swimming!",
        "🌱 Trees, animals, and people all live here",
        "🛡️ Earth has an invisible shield protecting us!",
        "🌙 Our Moon is Earth's best friend - they dance together!"
      ],
      action: "Coming home to our beautiful blue planet...",
      target: { x: 10, y: 0, z: 0 },
      zoom: 2.5,
      planetImage: "textures/2k_earth_daymap.jpg",
      planetName: "Earth 🌍",
      funFact: "Earth is the only planet where you can have a birthday party!",
      kidQuestion: "What makes Earth so special compared to other planets?",
      animation2D: "earthRotation"
    },
    {
      title: "🔴 Mars - The Red Dusty Planet!",
      content: [
        "🔴 Mars is red because it's covered in rust! (Like old metal)",
        "🏔️ It has the biggest mountain in the whole solar system!",
        "🤖 Robot explorers are driving around there right now!",
        "❄️ It has ice caps on top and bottom, just like Earth!",
        "🌙 Mars has 2 tiny moons that look like potatoes!"
      ],
      action: "Exploring the red, rusty world...",
      target: { x: 14, y: 0, z: 0 },
      zoom: 3.0,
      planetImage: "textures/2k_mars.jpg",
      planetName: "Mars 🔴",
      funFact: "Scientists think people might visit Mars someday - maybe you!",
      kidQuestion: "Would you like to be the first kid to visit Mars?",
      animation2D: "dustStorm"
    },
    {
      title: "🪐 Jupiter - The Giant Protector!",
      content: [
        "🏀 Jupiter is HUGE - 1,300 Earths could fit inside!",
        "🌪️ It has a giant red storm bigger than our whole Earth!",
        "🛡️ Jupiter protects us by catching dangerous space rocks!",
        "🌙 It has 95 moons - like having 95 friends!",
        "⚡ It has lightning storms that are purple and blue!"
      ],
      action: "Meeting the gentle giant of our solar system...",
      target: { x: 20, y: 0, z: 0 },
      zoom: 1.2,
      planetImage: "textures/2k_jupiter.jpg",
      planetName: "Jupiter 🪐",
      funFact: "Jupiter's Great Red Spot storm has been going for over 400 years!",
      kidQuestion: "How do you think Jupiter protects Earth?",
      animation2D: "greatRedSpot"
    },
    {
      title: "💍 Saturn - The Planet with Jewelry!",
      content: [
        "💍 Saturn wears beautiful rings like fancy jewelry!",
        "🧊 The rings are made of ice chunks and space rocks",
        "🎈 Saturn is so light, it would float in a bathtub!",
        "🌙 It has a moon called Titan with orange clouds",
        "🔶 It has a weird hexagon shape at the top!"
      ],
      action: "Admiring the most beautiful planet...",
      target: { x: 28, y: 0, z: 0 },
      zoom: 1.0,
      planetImage: "textures/2k_saturn.jpg",
      planetName: "Saturn 💍",
      funFact: "Saturn's rings are made of billions of pieces of ice!",
      kidQuestion: "What do you think Saturn's rings would feel like?",
      animation2D: "ringRotation"
    },
    {
      title: "🧊 Uranus - The Sideways Roller!",
      content: [
        "🤸 Uranus rolls on its side like a ball!",
        "🧊 It's made of water, ice, and gas - like a giant slushie!",
        "💎 It might rain diamonds there! ✨",
        "🌀 It's tilted so much, it's almost upside down!",
        "🎭 Its moons are named after characters from plays!"
      ],
      action: "Rolling toward the sideways ice giant...",
      target: { x: 36, y: 0, z: 0 },
      zoom: 1.5,
      planetImage: "textures/2k_uranus.jpg",
      planetName: "Uranus 🧊",
      funFact: "On Uranus, seasons last 21 Earth years each!",
      kidQuestion: "Why do you think Uranus spins on its side?",
      animation2D: "sidewaysRotation"
    },
    {
      title: "🌊 Neptune - The Windy Blue Giant!",
      content: [
        "💨 Neptune has the strongest winds in the solar system!",
        "💙 It's beautiful blue color comes from a gas called methane",
        "🌪️ Winds blow faster than jet planes - whoosh!",
        "❄️ It's the coldest planet - brrrr! -200°C!",
        "🔭 It's so far away, it takes 165 years to go around the Sun!"
      ],
      action: "Sailing to the distant blue world...",
      target: { x: 45, y: 0, z: 0 },
      zoom: 1.8,
      planetImage: "textures/2k_neptune.jpg",
      planetName: "Neptune 🌊",
      funFact: "Neptune is so far that sunlight takes 4 hours to reach it!",
      kidQuestion: "What do you think it would be like to fly in Neptune's winds?",
      animation2D: "windStreaks"
    },
    {
      title: "🎓 Congratulations, Space Explorer!",
      content: [
        "🌟 WOW! You've completed the ENTIRE solar system tour!",
        "🏆 You're now an official Space Explorer!",
        "🧠 You learned about all 8 amazing planets",
        "☀️ You discovered how special our Sun is",
        "🌍 You understand why Earth is the best home ever!",
        "🚀 Ready for your next space adventure?"
      ],
      action: "Celebrating your amazing journey through space!",
      target: { x: 0, y: 0, z: 0 },
      zoom: 0.08,
      planetImage: null,
      funFact: "Scientists are always discovering new things about space!",
      kidQuestion: "Which planet was your favorite and why?",
      animation2D: "celebration"
    }
  ];
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
