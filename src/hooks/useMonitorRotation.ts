import { useRef, useEffect, useState } from "react";

export function useMonitorRotation(initialRotation: [number, number, number]) {
  const [rotation, setRotation] = useState<[number, number, number]>(initialRotation);
  const targetRotation = useRef<[number, number, number]>(initialRotation);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { width, height, left, top } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      const rotY = Math.PI - 0.2 + (x - 0.5) * 0.2;
      const rotX = (y - 0.5) * 0.1;
      targetRotation.current = [rotX, rotY, 0];
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let frame: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      setRotation(prev => [
        lerp(prev[0], targetRotation.current[0], 0.03),
        lerp(prev[1], targetRotation.current[1], 0.03),
        0
      ]);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return { rotation, containerRef };
}
