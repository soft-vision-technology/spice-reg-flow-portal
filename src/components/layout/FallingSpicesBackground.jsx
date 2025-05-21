import React, { useEffect, useRef } from "react";

const spiceEmojis = ["🌶️", "🧂", "🌿", "🍃", "🌶", "🫚", "🍂", "✨"];

const FallingSpicesBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let spices = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    
    window.addEventListener("resize", resizeCanvas);
    
    class Spice {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -50; // Start above the visible area
        this.size = Math.random() * 20 + 15; // Size between 15-35px
        this.speedY = Math.random() * 1; // Vertical speed
        this.speedX = Math.random() * 1; // Horizontal drift
        this.emoji = spiceEmojis[Math.floor(Math.random() * spiceEmojis.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5);
        this.opacity = Math.random() * 0.7 + 0.3;
      }
      
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height + 50) {
          this.y = -50;
          this.x = Math.random() * canvas.width;
        }
        
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, 0, 0);
        ctx.restore();
      }
    }
  
    const createSpices = () => {
      const numberOfSpices = Math.min(50, Math.floor(window.innerWidth / 30));
      spices = [];
      for (let i = 0; i < numberOfSpices; i++) {
        const spice = new Spice();
        spice.y = Math.random() * canvas.height;
        spices.push(spice);
      }
    };
    
    createSpices();
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      spices.forEach(spice => {
        spice.update();
        spice.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.25 }}
    />
  );
};

export default FallingSpicesBackground;