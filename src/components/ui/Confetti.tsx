import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = [
      '#A855F7', // Violet
      '#06B6D4', // Cyan
      '#EC4899', // Pink
      '#3B82F6', // Blue
      '#10B981', // Emerald
      '#F59E0B'  // Amber
    ];

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const createParticle = (x: number, y: number, dir: 'left' | 'right'): Particle => {
      const angle = dir === 'left' 
        ? (Math.PI / 4) + Math.random() * (Math.PI / 6) // shoot up-right
        : (3 * Math.PI / 4) - Math.random() * (Math.PI / 6); // shoot up-left
      
      const speed = Math.random() * 12 + 8;
      
      return {
        x,
        y,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * speed,
        speedY: -Math.sin(angle) * speed - (Math.random() * 3), // upward speed
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      };
    };

    const spawnConfetti = () => {
      const leftX = window.innerWidth * 0.05;
      const rightX = window.innerWidth * 0.95;
      const spawnY = window.innerHeight * 0.85;

      // Spawn 60 particles from left and 60 from right
      for (let i = 0; i < 60; i++) {
        particles.push(createParticle(leftX, spawnY, 'left'));
        particles.push(createParticle(rightX, spawnY, 'right'));
      }
    };

    const updateAndDraw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter(p => p.opacity > 0.01 && p.y < canvas.height && p.x > -50 && p.x < canvas.width + 50);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.22; // gravity
        p.speedX *= 0.98; // wind resistance
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.01; // slow fade out

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Draw rectangle particle
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(updateAndDraw);
      }
    };

    const handleTrigger = () => {
      spawnConfetti();
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    window.addEventListener('trigger-confetti' as any, handleTrigger);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('trigger-confetti' as any, handleTrigger);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
    />
  );
};
