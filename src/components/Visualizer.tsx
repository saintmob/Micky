import { useEffect, useRef } from 'react';
import { audioManager } from '../lib/audioManager';
import { useDJStore } from '../store/djStore';

export function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useDJStore(state => state.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Handle resizing cleanly
      const parent = canvas.parentElement;
      if (parent) {
        if (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      }

      const width = canvas.width;
      const height = canvas.height;

      // Determine active theme boolean based on classlist for accuracy to react tree
      const isDark = document.documentElement.classList.contains('dark');

      // Draw background with slight fade for motion blur effect
      ctx.fillStyle = isDark ? 'rgba(17, 17, 17, 0.2)' : 'rgba(255, 255, 255, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      // Get Tone.js analyzer data
      const floatData = audioManager.getAnalyzerFloatData();
      
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      const barWidth = width / floatData.length;
      let x = 0;

      for (let i = 0; i < floatData.length; i++) {
        // floatData is usually from -100 to 0 dB. We normalize it.
        const db = floatData[i];
        // map db (-100 to 0) to height (0 to 1)
        let normalized = (db + 100) / 100;
        normalized = Math.max(0, Math.min(1, normalized)); // clamp
        
        const y = height - (normalized * height * 0.8);

        ctx.lineTo(x, y);

        // draw pulse circle at low freq
        if (i < 4 && normalized > 0.6) {
          ctx.beginPath();
          ctx.arc(width/2, height/2, normalized * 150, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 0, 85, ${normalized * 0.05})`; // #ff0055 accent
          ctx.fill();
          ctx.beginPath();
        }

        x += barWidth;
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      // Style waveform
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, isDark ? 'rgba(0, 243, 255, 0.1)' : 'rgba(0, 150, 255, 0.1)'); 
      gradient.addColorStop(1, 'rgba(255, 0, 85, 0.6)');  // #ff0055
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.strokeStyle = isDark ? '#00f3ff' : '#0096ff';
      ctx.lineWidth = 1;
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []); // Leaving empty is somewhat okay, but the theme variable doesn't need to trigger rebinds as `render` runs continually

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </>
  );
}
