
import { useEffect, useRef } from "react";

const CHARACTERS = [
  ..."ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ",
  ..."0123456789ABCDEF",
];

export default function DigitalRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = 0;
    let height = 0;
    let columns = [];
    let lastTime = 0;

    const fontSize = 14;
    const trailLength = 10;
    const glyph = () =>
      CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";

      const count = Math.ceil(width / fontSize);

      columns = Array.from({ length: count }, () => ({
        y: Math.random() * height,
        speed: 35 + Math.random() * 90,
        active: Math.random() > 0.28,
        chars: Array.from({ length: trailLength }, glyph),
      }));
    }

    function draw(time) {
      const delta = lastTime
        ? Math.min((time - lastTime) / 1000, 0.05)
        : 0.016;

      lastTime = time;
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;

      columns.forEach((column, index) => {
        if (!column.active) return;

        column.y += column.speed * delta;
        const x = index * fontSize + fontSize / 2;

        if (Math.random() < 0.08) {
          const position = Math.floor(Math.random() * trailLength);
          column.chars[position] = glyph();
        }

        column.chars.forEach((character, i) => {
          const y = column.y - i * fontSize;

          if (y < 0 || y > height) return;

          const opacity = Math.max(0.05, 1 - i / trailLength);
          ctx.globalAlpha = opacity;

          ctx.fillStyle =
            i === 0
              ? "#ffffff"
              : i < 3
                ? "#dfff55"
                : "#b9d92b";

          ctx.fillText(character, x, y);
        });

        if (column.y - trailLength * fontSize > height) {
          column.y = -Math.random() * height * 0.5;
          column.speed = 35 + Math.random() * 90;
          column.active = Math.random() > 0.15;
          column.chars = Array.from({ length: trailLength }, glyph);
        }
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    animationId = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="digital-rain" aria-hidden="true" />;
}
