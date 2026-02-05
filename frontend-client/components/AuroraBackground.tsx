"use client";

import React from "react";

export default function AuroraBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            {/* Soft gradient orbs */}
            <div
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full filter blur-[80px] opacity-40 animate-blob bg-[#FF4851] transform-gpu will-change-transform"
            />
            <div
                className="absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full filter blur-[80px] opacity-40 animate-blob animation-delay-2000 bg-purple-300 transform-gpu will-change-transform"
            />
            <div
                className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full filter blur-[80px] opacity-40 animate-blob animation-delay-4000 bg-pink-300 transform-gpu will-change-transform"
            />


            {/* Grain/Noise overlay for texture (optional) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
}
