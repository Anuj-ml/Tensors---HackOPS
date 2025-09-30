import { useEffect, useRef } from 'react';

interface ThreeSceneProps {
  className?: string;
  variant?: 'sphere' | 'cube' | 'waves';
}

export function ThreeScene({ className = '', variant = 'sphere' }: ThreeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.fillRect(0, 0, width, height);

      if (variant === 'sphere') {
        // Animated 3D sphere wireframe
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;

        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 1;

        // Draw latitude lines
        for (let i = 0; i < 8; i++) {
          const y = centerY + Math.sin((i / 8) * Math.PI - Math.PI / 2) * radius;
          const ellipseRadius = Math.cos((i / 8) * Math.PI - Math.PI / 2) * radius;
          
          ctx.beginPath();
          ctx.ellipse(centerX, y, ellipseRadius, ellipseRadius * 0.3, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw longitude lines
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + time * 0.01;
          ctx.beginPath();
          for (let j = 0; j <= 20; j++) {
            const t = (j / 20) * Math.PI;
            const x = centerX + Math.sin(t) * Math.cos(angle) * radius;
            const y = centerY + Math.cos(t) * radius;
            const z = Math.sin(t) * Math.sin(angle) * radius;
            
            // Simple 3D projection
            const scale = 1 + z / (radius * 2);
            const projX = centerX + (x - centerX) * scale;
            const projY = centerY + (y - centerY) * scale;
            
            if (j === 0) {
              ctx.moveTo(projX, projY);
            } else {
              ctx.lineTo(projX, projY);
            }
          }
          ctx.stroke();
        }
      } else if (variant === 'cube') {
        // Rotating 3D cube
        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.2;

        const rotX = time * 0.01;
        const rotY = time * 0.015;

        const vertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];

        const rotatedVertices = vertices.map(([x, y, z]) => {
          // Rotate around X axis
          const y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
          const z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
          
          // Rotate around Y axis
          const x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
          const z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);
          
          return [x2 * size, y1 * size, z2 * size];
        });

        const projectedVertices = rotatedVertices.map(([x, y, z]) => [
          centerX + x,
          centerY + y
        ]);

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // front face
          [4, 5], [5, 6], [6, 7], [7, 4], // back face
          [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
        ];

        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 2;

        edges.forEach(([start, end]) => {
          ctx.beginPath();
          ctx.moveTo(projectedVertices[start][0], projectedVertices[start][1]);
          ctx.lineTo(projectedVertices[end][0], projectedVertices[end][1]);
          ctx.stroke();
        });
      } else if (variant === 'waves') {
        // Animated wave pattern
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 2;

        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 2) {
            const y = height / 2 + 
              Math.sin((x + time * 2) * 0.01 + i * 0.5) * 30 +
              Math.sin((x + time * 3) * 0.005 + i * 0.3) * 20;
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.globalAlpha = 0.8 - i * 0.15;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}