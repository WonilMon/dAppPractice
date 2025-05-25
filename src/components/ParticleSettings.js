import React from 'react';
import Particles from 'react-tsparticles';

const ParticleSettings = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      <Particles
        id="tsparticles"
        options={{
          fpsLimit: 60,
          background: {
            color: { value: '#e6fff7' }, // 밝은 민트톤 배경
          },
          interactivity: {
            events: {
              onClick: { enable: true, mode: 'push' },
              onHover: { enable: true, mode: 'repulse' },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 150, duration: 0.4 },
            },
          },
          particles: {
            color: { value: '#589e7d' }, // 선 색상
            links: {
              color: '#589e7d',
              distance: 200,
              enable: true,
              opacity: 0.6,
              width: 1,
            },
            collisions: { enable: false },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              speed: 1.5,
            },
            number: {
              density: { enable: true, area: 900 },
              value: 90,
            },
            opacity: {
              value: { min: 0.1, max: 0.7 },
              animation: {
                enable: true,
                speed: 0.7,
              },
            },
            shape: {
              type: 'circle', // 별모양
              options: {
                star: { sides: 5 },
              },
            },
            size: {
              value: { min: 1, max: 4 },
              animation: {
                enable: true,
                speed: 3,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default ParticleSettings;
