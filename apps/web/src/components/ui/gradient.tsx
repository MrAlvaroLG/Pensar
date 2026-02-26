"use client"

import React, { useMemo, useSyncExternalStore } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

export interface BackgroundGradientProps {
  className?: string
  children?: React.ReactNode
}

const BUBBLES = [
  { size: "min(80vw, 80vh)", color: "rgba(59, 130, 246, 0.5)", duration: 25, blur: "blur-[120px]", opacity: 0.4 },
  { size: "min(80vw, 80vh)", color: "rgba(59, 130, 246, 0.5)", duration: 25, blur: "blur-[120px]", opacity: 0.4 },
  { size: "min(90vw, 90vh)", color: "rgba(239, 68, 68, 0.4)", duration: 30, blur: "blur-[120px]", opacity: 0.4 },
  { size: "min(90vw, 90vh)", color: "rgba(239, 68, 68, 0.4)", duration: 30, blur: "blur-[120px]", opacity: 0.4 },
  { size: "min(70vw, 70vh)", color: "rgba(37, 99, 235, 0.45)", duration: 28, blur: "blur-[100px]", opacity: 0.4 },
  { size: "min(75vw, 75vh)", color: "rgba(220, 38, 38, 0.4)", duration: 32, blur: "blur-[100px]", opacity: 0.35 },
];

const generateRandomPath = (numPoints = 6) => {
  const path = Array.from({ length: numPoints }, () => `${Math.floor(Math.random() * 120) - 20}%`);
  path.push(path[0]);
  return path;
};

const emptySubscribe = () => () => {};

export const BackgroundGradient = ({ className, children }: BackgroundGradientProps) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false, 
  );

  const paths = useMemo(() => {
    if (!isMounted) return null;

    return BUBBLES.map(() => ({
      x: generateRandomPath(6),
      y: generateRandomPath(6),
    }));
  }, [isMounted]);

  return (
    <div className={cn("relative h-screen w-full overflow-hidden bg-background", className)}>
      
      {paths && BUBBLES.map((bubble, index) => (
        <motion.div
          key={index}
          className={cn("absolute rounded-full pointer-events-none", bubble.blur)}
          style={{
            width: bubble.size,
            height: bubble.size,
            background: `radial-gradient(circle, ${bubble.color} 0%)`,
          }}
          initial={{ 
            opacity: 0, 
            x: paths[index].x[0], 
            y: paths[index].y[0] 
          }}
          animate={{
            opacity: bubble.opacity,
            x: paths[index].x,
            y: paths[index].y,
          }}
          transition={{
            opacity: { duration: 2 },
            x: {
              duration: bubble.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
            y: {
              duration: bubble.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <BackgroundGradient>
      <div className="flex flex-col items-center justify-center h-full px-4 text-center space-y-8">
        <div className="space-y-4 max-w-3xl flex flex-col items-center">
          <div className="flex justify-center w-full">
            <Image
              src="logo/Logo Negro.svg"
              alt="Pensar"
              width={0}
              height={0}
              sizes="(max-width: 640px) 60px, 100px"
              className="w-15 h-15 md:w-30 md:h-30"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold extrabold-tight text-foreground drop-shadow-2xl">
            Pensar
          </h1>
          <p className="text-base md:text-2xl text-muted-foreground font-bold text-balance ">
            Un espacio donde la fe se explica mediante la razón
          </p>
        </div>

        <Button className="w-full max-w-xs md:max-w-none md:w-auto">
          Explorar debates
        </Button>
      </div>
    </BackgroundGradient>
  )
}