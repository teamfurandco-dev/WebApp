import { motion } from 'framer-motion';

const UnlimitedBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Blob 1: Top Left */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 0.85, 1.1, 1],
                    rotate: [0, 60, -60, 30, 0],
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "30% 60% 70% 40% / 50% 60% 30% 60%",
                        "50% 50% 40% 60% / 60% 40% 50% 50%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ],
                    x: [0, 80, -60, 40, 0],
                    y: [0, 50, -40, 30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -left-20 w-[350px] h-[350px] bg-gradient-to-br from-[#FFF7CC] to-white/20 opacity-40 mix-blend-overlay"
            />

            {/* Blob 2: Top Right */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 0.9, 1],
                    rotate: [0, -60, 60, -30, 0],
                    borderRadius: [
                        "20% 80% 20% 80% / 80% 20% 80% 20%",
                        "60% 40% 60% 40% / 40% 60% 40% 60%",
                        "40% 60% 30% 70% / 70% 30% 60% 40%",
                        "20% 80% 20% 80% / 80% 20% 80% 20%"
                    ],
                    x: [0, -80, 50, -30, 0],
                    y: [0, 60, -50, 20, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-[340px] h-[340px] bg-gradient-to-tl from-[#FDBA74] to-[#FDE047] opacity-30 mix-blend-overlay"
            />

            {/* Blob 3: Middle Left */}
            <motion.div
                animate={{
                    scale: [1, 1.25, 0.9, 1.1, 1],
                    rotate: [0, -45, 45, -20, 0],
                    borderRadius: [
                        "20% 80% 20% 80% / 80% 20% 80% 20%",
                        "60% 40% 60% 40% / 40% 60% 40% 60%",
                        "45% 55% 55% 45% / 55% 45% 45% 55%",
                        "20% 80% 20% 80% / 80% 20% 80% 20%"
                    ],
                    x: [0, 70, -50, 30, 0],
                    y: [0, -80, 60, -40, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[45%] -left-20 w-[380px] h-[380px] bg-gradient-to-tl from-[#FDBA74] to-[#FDE047] opacity-30 mix-blend-overlay"
            />

            {/* Blob 4: Center */}
            <motion.div
                animate={{
                    y: [0, -100, 80, -50, 0],
                    x: [0, 60, -80, 40, 0],
                    rotate: [0, 120, 240, 360],
                    scale: [1, 0.75, 1.15, 0.9, 1],
                    borderRadius: [
                        "50% 50% 50% 50% / 50% 50% 50% 50%",
                        "30% 70% 70% 30% / 30% 30% 70% 70%",
                        "60% 40% 40% 60% / 40% 60% 60% 40%",
                        "50% 50% 50% 50% / 50% 50% 50% 50%"
                    ],
                }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] right-[35%] w-[300px] h-[300px] bg-white opacity-25"
            />

            {/* Blob 5: Bottom Left */}
            <motion.div
                animate={{
                    y: [0, -90, 70, -40, 0],
                    x: [0, 50, -70, 30, 0],
                    rotate: [0, 90, 180, 270, 360],
                    scale: [1, 0.8, 1.2, 0.9, 1],
                    borderRadius: [
                        "50% 50% 50% 50% / 50% 50% 50% 50%",
                        "30% 70% 70% 30% / 30% 30% 70% 70%",
                        "55% 45% 45% 55% / 45% 55% 55% 45%",
                        "50% 50% 50% 50% / 50% 50% 50% 50%"
                    ]
                }}
                transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 left-10 w-[320px] h-[320px] bg-white opacity-20"
            />

            {/* Blob 6: Bottom Right */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 0.85, 1.1, 1],
                    rotate: [0, 70, -50, 30, 0],
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "30% 60% 70% 40% / 50% 60% 30% 60%",
                        "45% 55% 50% 50% / 50% 50% 55% 45%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ],
                    x: [0, -70, 60, -40, 0],
                    y: [0, -60, 50, -30, 0],
                }}
                transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-20 -right-20 w-[380px] h-[380px] bg-gradient-to-br from-[#FFF7CC] to-white/20 opacity-40 mix-blend-overlay"
            />

            {/* Noise/Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
        </div>
    );
};

export default UnlimitedBackground;
