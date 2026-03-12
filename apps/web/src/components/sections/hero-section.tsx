"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import BlurText from "@/components/text/blur"
import Image from "next/image"

const blurAnimation = {
    from: { filter: "blur(10px)", opacity: 0, y: -50 },
    to: [
        { filter: "blur(5px)", opacity: 0.5, y: 5 },
        { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
}

const fadeInTransition = {
    initial: { filter: "blur(10px)", opacity: 0, y: -50 },
    animate: { filter: "blur(0px)", opacity: 1, y: 0 },
    transition: { duration: 1.3, ease: "easeOut" as const },
}

export default function HeroSection() {
    return (
        <BackgroundGradient>
            <div className="relative flex h-full flex-col items-center justify-center space-y-8 px-4 text-center">
                <div className="flex max-w-3xl flex-col items-center space-y-4">
                    <motion.div {...fadeInTransition}>
                        <Image
                            src="/logo/logo-negro.svg"
                            alt="Pensar"
                            width={120}
                            height={120}
                            className="h-16 w-16 md:h-32 md:w-32"
                            priority
                        />
                    </motion.div>

                    <BlurText
                        text="Pensar"
                        className="extrabold-tight text-4xl font-bold text-foreground drop-shadow-2xl md:text-6xl"
                        animateBy="letters"
                        direction="top"
                        animationFrom={blurAnimation.from}
                        animationTo={blurAnimation.to}
                        easing="easeOut"
                    />

                    <BlurText
                        text="Un espacio donde la fe se explica mediante la razón"
                        className="text-balance text-center text-base font-bold text-secondary-foreground md:text-2xl"
                        animateBy="words"
                        direction="top"
                        delay={100}
                        animationFrom={blurAnimation.from}
                        animationTo={blurAnimation.to}
                        easing="easeOut"
                    />
                </div>

                <motion.div {...fadeInTransition}>
                    <Button asChild className="w-full max-w-xs md:w-auto md:max-w-none">
                        <a href="/debates">
                            Explorar debates
                        </a>
                    </Button>
                </motion.div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-30 bg-linear-to-b from-transparent via-background/70 to-background md:h-50" />
            </div>
        </BackgroundGradient>
    )
}
