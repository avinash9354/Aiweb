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
            onHover: { enable: true, mode: ['bubble', 'grab'] },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            bubble: { distance: 250, size: 8, duration: 0.5, opacity: 0.9, color: '#06b6d4' },
            grab: { distance: 200, links: { opacity: 0.5 } },
            push: { quantity: 4 },
          },
        },
        particles: {
          number: { value: 240, density: { enable: true, area: 1000 } },
          color: { value: ['#6366f1', '#8b5cf6', '#06b6d4', '#ec4899', '#f8fafc', '#ffd700'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.1, max: 0.9 },
            animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false },
          },
          size: {
            value: { min: 0.5, max: 4 },
            animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false },
          },
          links: {
            enable: true,
            distance: 120,
            color: '#8b5cf6',
            opacity: 0.2,
            width: 1,
            triangles: { enable: true, color: '#6366f1', opacity: 0.03 },
          },
          move: {
            enable: true,
            speed: { min: 0.1, max: 0.5 },
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'out' },
          },
          shadow: {
            enable: true,
            color: '#6366f1',
            blur: 8,
          },
          twinkle: {
            particles: { enable: true, color: '#ffffff', frequency: 0.05, opacity: 1 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
