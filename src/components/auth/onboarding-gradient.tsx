"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function OnboardingGradient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-full w-full bg-[#1a1633]" />

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1a1633]">
      {/* New Generated Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg-v2.png"
          alt="Aera Abstract Wave"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Satin Sheen Overlay - Keeping subtle depth */}
      <div className="absolute inset-0 bg-transparent mix-blend-overlay z-0 pointer-events-none" />

      {/* Quote Content */}
      <div className="relative z-10 h-full flex flex-col justify-end items-center pb-24 px-8 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-xl"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white leading-snug tracking-tight drop-shadow-2xl">
            “Change doesn't start with action, <br />
            It starts with a decision to see differently.”
          </h2>
          <div className="text-right mt-6 mr-4">
            <p className="text-xs md:text-sm font-medium text-white/70 tracking-[0.2em] uppercase">
              — TAWFIQ HUSSAIN
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
