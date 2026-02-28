"use client"

import React, { useMemo, useSyncExternalStore } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import BlurText from "@/components/text/blur"

export interface BackgroundGradientProps {
  className?: string
  children?: React.ReactNode
}

const BUBBLES = [
  { size: "min(80vw, 80vh)", color: "59, 130, 246", duration: 25, opacity: 0.5 }, 
  { size: "min(80vw, 80vh)", color: "59, 130, 246", duration: 25, opacity: 0.5 },
  { size: "min(90vw, 90vh)", color: "239, 68, 68", duration: 30, opacity: 0.5 },
  { size: "min(90vw, 90vh)", color: "239, 68, 68", duration: 30, opacity: 0.5 },
  { size: "min(70vw, 70vh)", color: "37, 99, 235", duration: 28, opacity: 0.5 }, 
  { size: "min(70vw, 70vh)", color: "37, 99, 235", duration: 28, opacity: 0.5 },
  { size: "min(75vw, 75vh)", color: "220, 38, 38", duration: 32, opacity: 0.5 }, 
  { size: "min(75vw, 75vh)", color: "220, 38, 38", duration: 32, opacity: 0.5 },
];

const generateRandomPath = (numPoints = 6, unit = "vw") => {
  const path = Array.from({ length: numPoints }, () => `${Math.floor(Math.random() * 100) - 50}${unit}`);
  path.push(path[0]);
  return path;
};

const emptySubscribe = () => () => {}
const useIsClient = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

export const BackgroundGradient = ({ className, children }: BackgroundGradientProps) => {
  const isClient = useIsClient();
  const paths = useMemo(() => {
    if (!isClient) return null;

    return BUBBLES.map(() => ({
      x: generateRandomPath(6, "vw"),
      y: generateRandomPath(6, "vh"),
    }));
  }, [isClient]);

  if (!paths) {
    return (
      <div className={cn("relative h-screen w-full overflow-hidden bg-background", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("relative h-screen w-full overflow-hidden bg-background", className)}>
      
      {paths.map((bubblePath, index) => {
        const bubble = BUBBLES[index];
        return (
          <motion.div
            key={index}
            className="absolute rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen will-change-transform"
            style={{
              width: bubble.size,
              height: bubble.size,
              background: `radial-gradient(circle closest-side, rgba(${bubble.color}, ${bubble.opacity}) 0%, rgba(${bubble.color}, 0) 100%)`,
              left: "50%",
              top: "50%",
              marginLeft: `calc(${bubble.size} / -2)`,
              marginTop: `calc(${bubble.size} / -2)`,
            }}
            initial={{ 
              opacity: 0, 
              x: bubblePath.x[0], 
              y: bubblePath.y[0] 
            }}
            animate={{
              opacity: 1,
              x: bubblePath.x,
              y: bubblePath.y,
            }}
            transition={{
              opacity: { duration: 1.5, ease: "easeIn" },
              x: {
                duration: bubble.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              y: {
                duration: bubble.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
          />
        );
      })}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 34%, rgba(255,255,255,0) 100%)"
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <BackgroundGradient>
      <div className="flex flex-col items-center justify-center h-full px-4 text-center space-y-8">
        <div className="space-y-4 max-w-3xl flex flex-col items-center">
          <div className="flex justify-center w-full">
            <motion.div
              initial={{ filter: "blur(10px)", opacity: 0, y: -50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
            >
              <Image
                src="logo/Logo Negro.svg"
                alt="Pensar"
                width={120}
                height={120}
                className="w-16 h-16 md:w-32 md:h-32"
                priority
              />
            </motion.div>
          </div>
          <BlurText
            text="Pensar"
            className="text-4xl md:text-6xl font-bold extrabold-tight text-foreground drop-shadow-2xl"
            animateBy="letters"
            direction="top"
            animationFrom={{ filter: "blur(10px)", opacity: 0, y: -50 }}
            animationTo={[
                { filter: "blur(5px)", opacity: 0.5, y: 5 },
                { filter: "blur(0px)", opacity: 1, y: 0 },
            ]}
            easing="easeOut"
          />
          <BlurText
            text="Un espacio donde la fe se explica mediante la razón"
            className="text-base md:text-2xl text-muted-foreground font-bold text-balance text-center"
            animateBy="words"
            direction="top"
            delay={100} 
            animationFrom={{ filter: "blur(10px)", opacity: 0, y: -50 }}
            animationTo={[
                { filter: "blur(5px)", opacity: 0.5, y: 5 },
                { filter: "blur(0px)", opacity: 1, y: 0 },
            ]}
            easing="easeOut"
          />
        </div>
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: -50 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        >
          <Button className="w-full max-w-xs md:max-w-none md:w-auto">
            Explorar debates
          </Button>
        </motion.div>
      </div>
    </BackgroundGradient>
  );
}