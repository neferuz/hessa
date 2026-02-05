'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        const xToCursor = gsap.quickSetter(cursor, "x", "px");
        const yToCursor = gsap.quickSetter(cursor, "y", "px");
        const xToFollower = gsap.quickSetter(follower, "x", "px");
        const yToFollower = gsap.quickSetter(follower, "y", "px");

        const moveCursor = (e: MouseEvent) => {
            xToCursor(e.clientX);
            yToCursor(e.clientY);

            // For the follower, we might still want the smooth tween, but let's try to optimize
            // or we can just stick to quickSetter for raw performance if desired, 
            // but usually follower needs lag. Let's keep the tween for follower but optimize cursor.
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: 'power3.out',
                overwrite: 'auto' // preventing conflict
            });
        };

        const handleHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isLink = target.closest('a') || target.closest('button') || target.closest('.hover-trigger');

            if (isLink) {
                gsap.to(follower, {
                    scale: 3,
                    duration: 0.3,
                    backgroundColor: 'rgba(255, 72, 81, 0.1)',
                    borderColor: 'transparent',
                    overwrite: 'auto'
                });
                gsap.to(cursor, {
                    scale: 0.5,
                    backgroundColor: '#FF4851',
                    overwrite: 'auto'
                });
            } else {
                gsap.to(follower, {
                    scale: 1,
                    duration: 0.3,
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(20, 20, 20, 0.2)',
                    overwrite: 'auto'
                });
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: '#FF4851',
                    overwrite: 'auto'
                });
            }
        };

        window.addEventListener('mousemove', moveCursor, { passive: true });
        window.addEventListener('mouseover', handleHover, { passive: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-[#FF4851] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-gray-400 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
            />
            <style jsx global>{`
        body, a, button {
          cursor: none;
        }
        /* Mobile handling: restore cursor */
        @media (max-width: 768px) {
          body, a, button {
            cursor: auto;
          }
          .fixed {
            display: none !important;
          }
        }
      `}</style>
        </>
    );
}
