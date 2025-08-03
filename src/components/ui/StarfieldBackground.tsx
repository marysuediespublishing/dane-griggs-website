import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  color: string;
}

interface StarfieldBackgroundProps {
  starCount?: number;
  className?: string;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({ 
  starCount = 150, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Adjust star count based on screen size
      const adjustedStarCount = window.innerWidth > 768 ? starCount : Math.floor(starCount * 0.6);
      
      // Generate stars if not already done or if count changed
      if (starsRef.current.length !== adjustedStarCount) {
        generateStars(adjustedStarCount);
      }
    };

    // Generate random stars
    const generateStars = (count: number) => {
      starsRef.current = [];
      const colors = [
        'rgba(255, 255, 255, 1)',      // White
        'rgba(244, 162, 97, 0.8)',     // Stellar gold
        'rgba(212, 51, 106, 0.6)',     // Cosmic rose
        'rgba(106, 76, 147, 0.4)',     // Nebula purple
      ];

      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1, // Size between 1-4
          opacity: Math.random() * 0.8 + 0.2, // Opacity between 0.2-1
          twinkleSpeed: Math.random() * 0.02 + 0.005, // Speed between 0.005-0.025
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    // Handle mouse movement for parallax effect
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2
      };
    };

    // Animate stars
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      starsRef.current.forEach((star, index) => {
        // Calculate parallax offset based on mouse position
        const parallaxX = mouseRef.current.x * (star.size * 0.5);
        const parallaxY = mouseRef.current.y * (star.size * 0.5);
        
        // Calculate twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + index) * 0.5 + 0.5;
        const currentOpacity = star.opacity * twinkle;
        
        // Set star style
        ctx.fillStyle = star.color.replace('1)', `${currentOpacity})`);
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = star.color;
        
        // Draw star
        ctx.beginPath();
        ctx.arc(
          star.x + parallaxX, 
          star.y + parallaxY, 
          star.size, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
        
        // Add glow effect for larger stars
        if (star.size > 2) {
          ctx.shadowBlur = star.size * 4;
          ctx.beginPath();
          ctx.arc(
            star.x + parallaxX, 
            star.y + parallaxY, 
            star.size * 0.5, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
        
        // Reset shadow
        ctx.shadowBlur = 0;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    
    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [starCount]);

  // Respect reduced motion preference
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionPreference = (e: MediaQueryListEvent) => {
      if (e.matches && animationFrameRef.current) {
        // Stop animation for reduced motion
        cancelAnimationFrame(animationFrameRef.current);
        
        // Draw static stars
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          starsRef.current.forEach(star => {
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleMotionPreference);
    return () => mediaQuery.removeEventListener('change', handleMotionPreference);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
      aria-hidden="true"
    />
  );
};

export default StarfieldBackground;