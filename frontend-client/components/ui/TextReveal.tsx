'use client';

import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function TextReveal({ children, className = '', delay = 0 }: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let animation: gsap.core.Tween | undefined;

        // Use a small timeout to ensure DOM is ready and fonts loaded
        const timeout = setTimeout(() => {
            const text = new SplitType(containerRef.current!, { types: 'lines,words' });

            // Wrap lines in overflow hidden containers
            text.lines?.forEach(line => {
                const wrapper = document.createElement('div');
                wrapper.style.overflow = 'hidden';
                wrapper.style.display = 'block';
                line.parentNode?.insertBefore(wrapper, line);
                wrapper.appendChild(line);
            });

            animation = gsap.fromTo(
                text.words,
                {
                    y: '100%',
                    opacity: 0,
                    rotate: 5
                },
                {
                    y: '0%',
                    opacity: 1,
                    rotate: 0,
                    duration: 1,
                    stagger: 0.02,
                    ease: 'power4.out',
                    delay: delay,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        }, 200);

        return () => {
            clearTimeout(timeout);
            if (animation) {
                animation.kill();
                if (animation.scrollTrigger) {
                    animation.scrollTrigger.kill();
                }
            }
        };
    }, [delay]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
