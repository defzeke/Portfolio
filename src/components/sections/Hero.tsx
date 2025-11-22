import React from "react";
export default function Hero() {
    const leftBldgRef = React.useRef<HTMLImageElement>(null);
    const rightBldgRef = React.useRef<HTMLImageElement>(null);
    const cloudsRef = React.useRef<HTMLImageElement>(null);
    const target = React.useRef({ x: 0, y: 0 });
    const current = React.useRef({ x: 0, y: 0 });
    const animationFrame = React.useRef<number>();

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            const w = window.innerWidth;
            const h = window.innerHeight;
            target.current.x = (x / w) * 2 - 1;
            target.current.y = (y / h) * 2 - 1;
        };
        window.addEventListener("mousemove", handleMouseMove);

        const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

        function animate() {
            current.current.x = lerp(current.current.x, target.current.x, 0.08);
            current.current.y = lerp(current.current.y, target.current.y, 0.08);

            // Max translation in px
            const maxX = 15;
            const maxY = 8;
            const cloudX = 10; 
            const cloudY = 5;

            // Left building
            if (leftBldgRef.current) {
                const transX = current.current.x * maxX;
                const transY = current.current.y * maxY;
                leftBldgRef.current.style.transform = `scale(1.2) translate(${transX}px, ${transY}px)`;
            }
            // Right building
            if (rightBldgRef.current) {
                const transX = current.current.x * maxX;
                const transY = current.current.y * maxY;
                rightBldgRef.current.style.transform = `scale(1.1) translate(${transX}px, ${transY}px)`;
            }
            // Clouds move in the opposite direction
            if (cloudsRef.current) {
                const transX = -current.current.x * cloudX;
                const transY = -current.current.y * cloudY;
                cloudsRef.current.style.transform = `translate(${transX}px, ${transY}px)`;
            }
            animationFrame.current = requestAnimationFrame(animate);
        }
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
        };
    }, []);

    return (
        <div className="flex justify-center items-end h-screen w-screen relative overflow-hidden" style={{ background: '#D3F6FF' }}>
            {/* SVG Noise Overlay */}
            <svg
                className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none"
                style={{ mixBlendMode: 'multiply', opacity: 0.12 }}
            >
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
            <img
                ref={cloudsRef}
                src="/clouds.png"
                alt="Clouds"
                className="absolute top-0 left-150 w-full h-auto max-h-[40vh] z-0 opacity-80 pointer-events-none select-none"
                style={{ objectFit: 'cover' }}
                draggable="false"
            />
            <img
                ref={leftBldgRef}
                src="/leftbldg.png"
                alt="Left Building"
                className="absolute left-0 h-full w-auto max-h-screen select-none pointer-events-none z-0"
                style={{ left: 0, bottom: '-10rem', margin: 0, padding: 0 }}
                draggable="false"
            />
            <img
                ref={rightBldgRef}
                src="/rightbldg.png"
                alt="Right Building"
                className="absolute right-0 h-full w-auto max-h-screen select-none pointer-events-none z-0"
                style={{ right: -200, bottom: '-10rem', margin: 0, padding: 0 }}
                draggable="false"
            />
            <img
                src="/boy.svg"
                alt="Boy"
                className="relative z-10 w-[75vw] max-w-[850px] max-h-[90vh] h-auto mb-[-50] animate-bounce-scale"
                draggable="false"
            />
        </div>
    );
}