import React, { useEffect, useRef } from 'react';

/**
 * LiquidGlassBackground
 * Ultra-premium animated blue liquid glass background.
 * Features: Flowing blobs, light refractions, shimmer & caustic effects.
 */
const LiquidGlassBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let t = 0;
    let w, h;

    // ─── Blob Config ─────────────────────────────────────────
    const BLOBS = [
      { x: 0.2, y: 0.3, r: 0.38, speed: 0.00034, phase: 0, color: [40, 120, 255] },
      { x: 0.75, y: 0.6, r: 0.42, speed: 0.00028, phase: 2, color: [0, 80, 220] },
      { x: 0.5, y: 0.15, r: 0.32, speed: 0.00041, phase: 4, color: [80, 160, 255] },
      { x: 0.15, y: 0.75, r: 0.30, speed: 0.00022, phase: 1, color: [20, 60, 200] },
      { x: 0.85, y: 0.2, r: 0.28, speed: 0.00037, phase: 3, color: [100, 180, 255] },
      { x: 0.6, y: 0.85, r: 0.35, speed: 0.00031, phase: 5, color: [30, 100, 230] },
    ];

    // ─── Shimmer Particles ─────────────────────────────────────
    const SHIMMER_COUNT = 80;
    let shimmers = [];

    class Shimmer {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * w;
        this.y = initial ? Math.random() * h : -10;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = Math.random() * 0.6 + 0.2;
        this.size = Math.random() * 2.5 + 0.5;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.alphaSpeed = Math.random() * 0.01 + 0.003;
        this.alphaDir = 1;
        this.life = Math.random() * 300 + 150;
        this.age = initial ? Math.random() * this.life : 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += this.alphaSpeed * this.alphaDir;
        if (this.alpha > 0.9 || this.alpha < 0.05) this.alphaDir *= -1;
        this.age++;
        if (this.age > this.life || this.y > h + 10) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgba(180, 220, 255, 1)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(100, 180, 255, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ─── Light Ray Config ─────────────────────────────────────
    const RAYS = Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      speed: (Math.random() - 0.5) * 0.0005,
      length: Math.random() * 0.4 + 0.3,
      alpha: Math.random() * 0.06 + 0.02,
    }));

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      shimmers = Array.from({ length: SHIMMER_COUNT }, () => new Shimmer());
    };

    window.addEventListener('resize', resize);
    resize();

    const drawBackground = () => {
      // Deep dark navy base
      ctx.fillStyle = '#020714';
      ctx.fillRect(0, 0, w, h);

      // Subtle ambient glow
      const ambient = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
      ambient.addColorStop(0, 'rgba(10, 30, 80, 0.6)');
      ambient.addColorStop(1, 'rgba(2, 7, 20, 0)');
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, w, h);
    };

    const drawBlobs = () => {
      BLOBS.forEach((blob, i) => {
        const bx = (blob.x + Math.sin(t * blob.speed + blob.phase) * 0.18) * w;
        const by = (blob.y + Math.cos(t * blob.speed * 0.8 + blob.phase) * 0.18) * h;
        const br = blob.r * Math.min(w, h);

        // Multi-layer liquid glass blob
        for (let layer = 3; layer >= 0; layer--) {
          const scale = 1 - layer * 0.08;
          const alpha = [0.12, 0.09, 0.06, 0.03][layer];
          const [r, g, b] = blob.color;

          const grad = ctx.createRadialGradient(
            bx - br * 0.25 * scale, by - br * 0.25 * scale, 0,
            bx, by, br * scale
          );
          grad.addColorStop(0, `rgba(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, 255, ${alpha + 0.05})`);
          grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha})`);
          grad.addColorStop(0.7, `rgba(${Math.max(r - 20, 0)}, ${Math.max(g - 20, 0)}, ${Math.max(b - 30, 180)}, ${alpha * 0.5})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(bx, by, br * scale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glass highlight / specular
        const spec = ctx.createRadialGradient(
          bx - br * 0.3, by - br * 0.3, 0,
          bx - br * 0.2, by - br * 0.2, br * 0.45
        );
        spec.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
        spec.addColorStop(0.5, 'rgba(200, 230, 255, 0.06)');
        spec.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = spec;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawLightRays = () => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const cx = w * 0.5, cy = h * 0.3;

      RAYS.forEach(ray => {
        ray.angle += ray.speed;
        const ex = cx + Math.cos(ray.angle) * w * ray.length;
        const ey = cy + Math.sin(ray.angle) * h * ray.length;

        const grad = ctx.createLinearGradient(cx, cy, ex, ey);
        grad.addColorStop(0, `rgba(80, 160, 255, ${ray.alpha * 2})`);
        grad.addColorStop(0.5, `rgba(40, 100, 220, ${ray.alpha})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.random() * 30 + 10;
        ctx.globalAlpha = ray.alpha;
        ctx.stroke();
      });

      ctx.restore();
    };

    const drawCaustics = () => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.04;

      for (let i = 0; i < 6; i++) {
        const cx = (0.2 + i * 0.12) * w + Math.sin(t * 0.0003 + i) * 80;
        const cy = (0.3 + Math.cos(i * 1.2) * 0.3) * h + Math.cos(t * 0.0004 + i) * 60;
        const cr = (0.05 + Math.abs(Math.sin(t * 0.0006 + i)) * 0.08) * Math.min(w, h);

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        g.addColorStop(0, 'rgba(150, 210, 255, 0.9)');
        g.addColorStop(0.4, 'rgba(80, 150, 255, 0.4)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawScanlines = () => {
      ctx.save();
      ctx.globalAlpha = 0.015;
      ctx.fillStyle = '#000';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }
      ctx.restore();
    };

    const animate = () => {
      t++;
      drawBackground();
      drawBlobs();
      drawLightRays();
      drawCaustics();

      shimmers.forEach(s => {
        s.update();
        s.draw();
      });

      drawScanlines();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default LiquidGlassBackground;
