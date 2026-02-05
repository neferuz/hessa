'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    speed?: number; // 0.5 = slow, 1 = normal, 2 = fast (reversed)
    priority?: boolean;
}

export default function ParallaxImage({
    src,
    alt,
    className = '',
    containerClassName = '',
    speed = 0.5,
    priority = false
}: ParallaxImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!containerRef.current || !imgRef.current) return;

        // A simple parallax: move the image slightly slower/faster than scroll
        // The container clips the image.

        gsap.fromTo(imgRef.current,
            {
                yPercent: -15 * speed,
                scale: 1.15 // Scale up slightly so we don't see edges
            },
            {
                yPercent: 15 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            }
        );

    }, [speed]);

    return (
        <div ref={containerRef} className={`overflow-hidden relative ${containerClassName}`}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`w-full h-full object-cover ${className}`}
            // If it was next/image we would use fill and parent relative, but standard img for simplicity with GSAP
            />
        </div>
    );
}
