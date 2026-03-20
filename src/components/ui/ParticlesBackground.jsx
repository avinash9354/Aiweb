// Galaxy Particles Background
import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            grab: { distance: 140, links: { opacity: 0.4 } },
            push: { quantity: 2 },
          },
        },
        particles: {
          color: { value: ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa', '#ffffff'] },
          links: {
            color: '#6366f1',
            distance: 130,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'bounce' },
          },
          number: { value: 90, density: { enable: true, area: 900 } },
          opacity: {
            value: { min: 0.2, max: 0.7 },
            animation: { enable: true, speed: 0.8, minimumValue: 0.1 },
          },
          shape: { type: ['circle', 'star'] },
          size: {
            value: { min: 1, max: 3 },
            animation: { enable: true, speed: 1.5, minimumValue: 0.5 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
