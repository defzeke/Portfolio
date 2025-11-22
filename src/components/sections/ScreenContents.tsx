
"use client";
import React from "react";
import LoadingWheel from "../ui/LoadingWheel";
import { useShutdownOverlay } from "../../hooks/useShutdownOverlay";
import { FileText, Power } from "lucide-react";
import { useRouter } from "next/navigation";

const ScreenContents: React.FC = () => {
    const router = useRouter();
    const [shuttingDown, overlayOpacity, triggerShutdown] = useShutdownOverlay();

    // Fade-in overlay state
    const [fadeIn, setFadeIn] = React.useState(false);
    const [fadeOpacity, setFadeOpacity] = React.useState(1);

    React.useEffect(() => {
        if (typeof window !== "undefined" && sessionStorage.getItem("fadeInScreen") === "1") {
            setFadeIn(true);
            setFadeOpacity(1);
            sessionStorage.removeItem("fadeInScreen");
            setTimeout(() => {
                setFadeOpacity(0);
            }, 80); 
        }
    }, []);

    // Remove overlay after fade
    React.useEffect(() => {
        if (fadeIn && fadeOpacity === 0) {
            const timeout = setTimeout(() => setFadeIn(false), 350);
            return () => clearTimeout(timeout);
        }
    }, [fadeIn, fadeOpacity]);

    const handlePowerClick = () => {
        if (shuttingDown) return;
        triggerShutdown();
        setTimeout(() => {
            router.push("/");
        }, 900);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* Fade-in from black overlay */}
            {fadeIn && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: '#000',
                    opacity: fadeOpacity,
                    transition: 'opacity 350ms cubic-bezier(.4,0,.2,1)',
                    zIndex: 99999,
                    pointerEvents: 'none',
                }} />
            )}
            <div
                style={{
                    marginTop: 24,
                    marginLeft: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    userSelect: 'none',
                    width: 80,
                }}
                tabIndex={0}
                role="button"
                aria-label="Open Portfolio"
                onClick={() => router.push('/screen/portfolio')}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') router.push('/screen/portfolio');
                }}
            >
                {/* PC file icon */}
                <div style={{
                    width: 64,
                    height: 64,
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                }}>
                    <FileText size={36} color="#60a5fa" />
                </div>
                {/* File title */}
                <span style={{
                    marginTop: 2,
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#fff',
                    textShadow: '0 1px 4px rgba(0,0,0,0.15)'
                }}>
                    Portfolio
                </span>
            </div>
            {/* Taskbar */}
            <div style={{
                position: 'fixed',
                left: 0,
                bottom: 0,
                width: '100vw',
                height: 48,
                background: 'rgba(24,24,27,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
                zIndex: 100
            }}>
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        marginRight: 24,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        transition: 'background 0.2s',
                    }}
                    title="Power Off"
                    onClick={handlePowerClick}
                    aria-label="Power Off"
                >
                    <Power size={28} color="#fff" />
                </button>
            </div>

            {/* Local shutting down overlay (before navigation) */}
            {shuttingDown && (
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
                    zIndex: 9999
                }}>
                    <LoadingWheel size={60} aria-label="Loading, shutting down" />
                    <div style={{ marginTop: 18, fontSize: 18, opacity: 0.95 }}>Shutting down...</div>
                </div>
            )}
        </div>
    );
}

export default ScreenContents;
