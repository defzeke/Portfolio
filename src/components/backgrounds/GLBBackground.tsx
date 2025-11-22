"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useMonitorRotation } from "../../hooks/useMonitorRotation";
import LoadingWheel from "../ui/LoadingWheel";
import { useShutdownOverlay } from "../../hooks/useShutdownOverlay";
import * as THREE from "three";

// Model component for GLTF
function Model({ url, rotation }: { url: string; rotation: [number, number, number] }) {
	const { scene } = useGLTF(url);
	React.useEffect(() => {
		scene.traverse((child: any) => {
			if (child.isMesh && child.material) {
				const mat = child.material;
				if (mat.emissive) {
					mat.emissive.set(0x000000);
					if ("emissiveIntensity" in mat) mat.emissiveIntensity = 0;
				}
				if (mat.emissiveMap) {
					mat.emissiveMap = null;
				}
				mat.needsUpdate = true;
			}
		});
	}, [scene]);
	return <primitive object={scene} scale={[1, 1, 1]} rotation={rotation} />;
}

export default function GLBBackground() {
	const { rotation, containerRef } = useMonitorRotation([0, Math.PI - 0.2, 0]);
	const [startTransition, setStartTransition] = React.useState(false);
	const [blackOverlay, setBlackOverlay] = React.useState({ active: false, opacity: 0 });
	const parallaxTriggered = useRef(false);
	const router = useRouter();
	const [shutdownActive, overlayOpacity] = useShutdownOverlay();

	// Triggered by SceneContent to fade in black overlay
	const triggerBlackFade = React.useCallback(() => {
		if (!blackOverlay.active) {
			setBlackOverlay({ active: true, opacity: 0 });
			const start = performance.now();
			function animate(now: number) {
				const elapsed = now - start;
				const t = Math.min(elapsed / 300, 1);
				setBlackOverlay({ active: true, opacity: t });
				if (t < 1) requestAnimationFrame(animate);
			}
			requestAnimationFrame(animate);
		}
	}, [blackOverlay.active]);

	const handleTransitionEnd = () => {
		sessionStorage.setItem("fadeInScreen", "1");
		router.push("/screen");
	};

	return (
		<div
			ref={containerRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				zIndex: -1,
				pointerEvents: "none",
			}}
		>
			<Canvas camera={{ position: [0, 2.2, 1.2] }}>
				<SceneContent
					startTransition={startTransition}
					onTransitionEnd={handleTransitionEnd}
					rotation={rotation}
					parallaxTriggered={parallaxTriggered}
					triggerBlackFade={triggerBlackFade}
				/>
			</Canvas>

			{/* Monitor area button */}
			<div
				style={{
					position: "fixed",
					left: "28vw",
					top: "32vh",
					width: "7vw",
					height: "12vh",
					zIndex: 10,
					background: "transparent",
					border: "0",
					pointerEvents: "auto",
					cursor: "pointer"
				}}
				aria-label="Monitor Button"
				tabIndex={0}
				onClick={() => setStartTransition(true)}
			/>

			{/* Second rectangle button */}
			<div
				style={{
					position: "fixed",
					left: "46vw",
					bottom: "32vh",
					width: "10vw",
					height: "8vh",
					zIndex: 10,
					background: "transparent",
					pointerEvents: "auto",
					cursor: "pointer",
					borderRadius: 8,
				}}
				aria-label="Second Rectangle Button"
				tabIndex={0}
				onClick={() => alert('coming soon')}
			/>

			{/* Black overlay fades in before camera animation ends */}
			{blackOverlay.active && (
				<div style={{
					position: 'fixed',
					inset: 0,
					background: '#000',
					opacity: blackOverlay.opacity,
					transition: 'none',
					zIndex: 99998,
					pointerEvents: 'auto',
				}} />
			)}

			{/* Shutdown overlay for power off */}
			{shutdownActive && (
				<div style={{
					position: 'fixed',
					inset: 0,
					background: '#000',
					opacity: overlayOpacity,
					transition: 'opacity 220ms ease',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					color: '#fff',
					zIndex: 99999,
					pointerEvents: 'auto'
				}}>
					<LoadingWheel size={60} aria-label="Loading, shutting down" />
					<div style={{ marginTop: 18, fontSize: 18, opacity: 0.95 }}>Shutting down...</div>
				</div>
			)}
		</div>
	);
}

// SceneContent handles the camera transition animation
function SceneContent({ startTransition, onTransitionEnd, rotation, parallaxTriggered, triggerBlackFade }: {
	startTransition: boolean,
	onTransitionEnd: () => void,
	rotation: [number, number, number],
	parallaxTriggered: React.MutableRefObject<boolean>,
	triggerBlackFade: () => void
}) {
	const { camera } = useThree();
	const [animating, setAnimating] = useState(false);
	const [animationStart, setAnimationStart] = useState<number | null>(null);
	const [blackFadeTriggered, setBlackFadeTriggered] = useState(false);
	const duration = 1.5; // seconds
	const targetPosition = new THREE.Vector3(-1.8, 0.9, -2.2);
	const startPosition = new THREE.Vector3(0, 2.2, 1.2);
	const startLookAt = new THREE.Vector3(0, 1.5, 0);
	const targetLookAt = new THREE.Vector3(-1.8, 0.9, -4);

	function easeInOutCubic(t: number) {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	useEffect(() => {
		if (startTransition && !animating) {
			setAnimating(true);
			setAnimationStart(performance.now());
			setBlackFadeTriggered(false);
		}
	}, [startTransition, animating]);

	useFrame(() => {
		if (animating && animationStart !== null) {
			const now = performance.now();
			const elapsed = (now - animationStart) / 1000;
			const t = Math.min(elapsed / duration, 1);
			const easedT = easeInOutCubic(t);
			camera.position.lerpVectors(startPosition, targetPosition, easedT);
			const lookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, easedT);
			camera.lookAt(lookAt);

			// Fade in black overlay earlier in the animation (e.g., t > 0.35)
			if (!blackFadeTriggered && t > 0.35) {
				setBlackFadeTriggered(true);
				triggerBlackFade();
			}

			if (!parallaxTriggered.current && camera.position.z < -1.7) {
				parallaxTriggered.current = true;
				onTransitionEnd();
			}

			if (t >= 1) {
				camera.position.copy(targetPosition);
				camera.lookAt(targetLookAt);
				setAnimating(false);
			}
		}
	});

	return (
		<>
			<ambientLight intensity={0.28} color="#323236ff" />
			<directionalLight position={[10, 10, 5]} intensity={0.1} color="#fff8e1" castShadow={true} />
			{/* Subtle monitor light for readable text */}
			<pointLight position={[-1.3, 1.3, -1]} intensity={1} color="#1df121" distance={1} decay={2.5} />
			{/* Dim light for second rectangle button (approximate position) */}
			<pointLight position={[-0.01, 0.1, -0.8]} intensity={0.4} color="#fff8e1" distance={1} decay={2.5} />
			<Suspense fallback={null}>
				<Model url="/models/myroom.glb" rotation={rotation} />
			</Suspense>
			<OrbitControls enableZoom={false} enablePan={false} enableRotate={false} target={[0, 1.5, 0]} />
		</>
	);
}
