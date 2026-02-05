import Image from "next/image";

export default function Hero() {
    return (
        <section className="px-6 pt-4 pb-12 relative overflow-hidden">
            <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-2 block">
                    Премиальный уход
                </span>
                <h1 className="text-[38px] font-black leading-[1] text-gray-900 tracking-[-0.04em] mb-4">
                    Здоровье и <br />
                    Эстетика
                </h1>
                <p className="text-sm text-gray-400 font-medium max-w-[200px] leading-relaxed">
                    Инновационные решения для вашего долголетия и красоты
                </p>
            </div>

            {/* Premium Floating Element */}
            <div className="absolute top-0 right-[-20px] w-56 h-56 z-0 opacity-80 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl rounded-full" />
                <Image
                    src="/removemedicince.png"
                    alt="Health"
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.15)] animate-float-slow"
                />
            </div>
        </section>
    );
}
