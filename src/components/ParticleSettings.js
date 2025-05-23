import React from 'react';
import Particles from 'react-tsparticles';

const ParticleSettings = () => {
  return (
    <Particles
      id="tsparticles"
      options={{
        background: {
          color: { value: '#ffffff' },
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
          color: { value: '#589e7d' },
          links: {
            color: '#589e7d',
            distance: 250,
            enable: true,
            opacity: 0.8,
            width: 1,
          },
          collisions: { enable: true },
          move: {
            direction: 'random',
            enable: true,
            outModes: 'bounce',
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: { value: 0.8 },
          shape: { type: 'char' },
          size: {
            value: 5,
            random: true,
          },
        },
        detectRetina: true,
        opacity: {
          value: { min: 0.3, max: 0.8 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        size: {
          value: { min: 2, max: 6 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        rotate: {
          value: 0,
          animation: {
            enable: true,
            speed: 10,
          },
        },
        shape: {
          type: 'star',
          options: {
            star: {
              sides: 5,
            },
          },
        },
      }}
    />
  );
};

export default ParticleSettings;
