import { useEffect, useRef } from "react";

type Props = {
  value: string;
};

export default function CaptchaCanvas({ value }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 34px monospace";
    ctx.fillStyle = "#000000ff"; 

    [...value].forEach((char, i) => {
      const x = 15 + i * 20;
      const y = 25 + Math.random() * 5;
      const angle = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = "rgba(36, 56, 116, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

  }, [value]);

  return (
    <canvas ref={canvasRef} width={150} height={40} className="w-full h-full object-contain" />
  );
}
