import React from 'react';
import Particles from 'react-tsparticles';

const ParticleSettings = () => {
  return (
    <Particles
      id="tsparticles"
      options={{
        background: {
          color: { value: '#04d47a1' },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push',
            },
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.9,
              size: 40,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: { value: '#ffffff' },
          links: {
            color: '#ffffff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: { enable: true },
          move: {
            direction: 'none',
            enable: true,
            outModes: 'bounce',
            random: false,
            speed: 3,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: { value: 0.5 },
          shape: { type: 'circle' },
          size: {
            value: 5,
            random: true,
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleSettings;
