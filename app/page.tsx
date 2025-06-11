"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Download, Sparkles, Star, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Improved type definitions
interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  delay: number
  size: number
  shape: "circle" | "square" | "heart" | "star"
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
}

interface StarElement {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

interface FloatingOrb {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
}

export default function BirthdayBook() {
  const [currentPage, setCurrentPage] = useState(0)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [stars, setStars] = useState<StarElement[]>([])
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrb[]>([])
  const [balloonPopped, setBalloonPopped] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 })
  const [isKeyPressed, setIsKeyPressed] = useState(false)
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate stars with memoization to improve performance
  useEffect(() => {
    if (!isClient) return

    const newStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
    }))
    setStars(newStars)
  }, [isClient])

  // Generate floating orbs with memoization
  useEffect(() => {
    if (!isClient) return

    const colors = ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4d9de0"]
    const newOrbs = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 100 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 4,
    }))
    setFloatingOrbs(newOrbs)
  }, [isClient])

  // Enhanced confetti generation with reduced count for better performance
  useEffect(() => {
    if (!isClient) return

    const colors = ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4d9de0", "#e15554", "#f9844a"]
    const shapes: Array<"circle" | "square" | "heart" | "star"> = ["circle", "square", "heart", "star"]

    // Reduced from 80 to 50 for better performance
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
      size: Math.random() * 8 + 4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }))
    setConfetti(newConfetti)
  }, [isClient])

  // Mouse tracking with throttling for better performance
  useEffect(() => {
    if (!isClient) return

    let lastTime = 0
    const throttleDelay = 50 // ms

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < throttleDelay) return
      lastTime = now

      setMousePosition({ x: e.clientX, y: e.clientY })

      // Create trailing particles with reduced frequency
      if (Math.random() < 0.05) {
        // Reduced from 0.1 to 0.05
        const newParticle: Particle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4d9de0"][Math.floor(Math.random() * 4)],
          size: Math.random() * 4 + 2,
          life: 1,
        }
        setParticles((prev) => [...prev.slice(-15), newParticle]) // Reduced from -20 to -15
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isClient])

  // Enhanced keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "KeyH") {
        e.preventDefault()
        setIsKeyPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "KeyH") {
        setIsKeyPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const handleBalloonClick = useCallback(() => {
    setBalloonPopped(true)
    // Create explosion effect
    if (isClient) {
      const explosionParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 100,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4d9de0"][Math.floor(Math.random() * 4)],
        size: Math.random() * 6 + 3,
        life: 1,
      }))
      setParticles((prev) => [...prev, ...explosionParticles])
    }

    setTimeout(() => {
      setCurrentPage(1)
    }, 1000)
  }, [isClient])

  const handleButtonHover = useCallback(() => {
    if (!isKeyPressed) {
      const newX = Math.random() * 60 + 20
      const newY = Math.random() * 60 + 20
      setButtonPosition({ x: newX, y: newY })
    }
  }, [isKeyPressed])

  const handleDownload = useCallback(() => {
    // Always allow download now for better UX
    setShowDownloadSuccess(true)

    // Create beautiful birthday card content
    const cardContent = `
🌟 Happy Birthday Parity Chizela! 🌟

On this day, we celebrate a true legend—Parity Chizela! A man whose loyalty runs deep, whose laughter fills every room, and whose friendship is a gift to all who know him.

Parity, may your year be filled with epic wins, new adventures, and moments that remind you how much you're appreciated. Here's to more memories, more success, and more good times ahead.

Keep being the awesome guy you are. The world's a better place with you in it. Cheers to you, bro! 🍻

Happy Birthday, Parity! 🎂🎉💙

With respect and brotherly wishes,
Your Birthday Book 📖✨
    `

    const link = document.createElement("a")
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(cardContent)
    link.download = "Parity-Birthday-Card.txt"
    link.click()

    setTimeout(() => setShowDownloadSuccess(false), 4000)
  }, [])

  const renderConfettiPiece = useCallback((piece: ConfettiPiece) => {
    const baseClasses = "absolute animate-confetti-dance"
    const style = {
      backgroundColor: piece.color,
      left: `${piece.x}%`,
      top: `${piece.y}%`,
      width: `${piece.size}px`,
      height: `${piece.size}px`,
      animationDelay: `${piece.delay}s`,
    }

    switch (piece.shape) {
      case "heart":
        return (
          <motion.div key={piece.id} className={baseClasses} style={style}>
            <Heart className="w-full h-full" style={{ color: piece.color }} fill="currentColor" />
          </motion.div>
        )
      case "star":
        return (
          <motion.div key={piece.id} className={baseClasses} style={style}>
            <Star className="w-full h-full" style={{ color: piece.color }} fill="currentColor" />
          </motion.div>
        )
      case "square":
        return <motion.div key={piece.id} className={`${baseClasses} rounded-sm`} style={style} />
      default:
        return <motion.div key={piece.id} className={`${baseClasses} rounded-full`} style={style} />
    }
  }, [])

  // Don't render random elements until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 via-indigo-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl font-playfair">Loading magical experience...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 via-indigo-900 to-black">
        {/* Animated galaxy background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent animate-galaxy-rotate" />
          <div
            className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent animate-galaxy-rotate"
            style={{ animationDirection: "reverse", animationDuration: "30s" }}
          />
        </div>

        {/* Enhanced twinkling stars */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white animate-star-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {/* Floating magical orbs */}
        {floatingOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full opacity-20 animate-float-up"
            style={{
              left: `${orb.x}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              animationDelay: `${orb.delay}s`,
              animationDuration: `${orb.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Mouse trail particles - only render active ones for performance */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none rounded-full z-50"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          animate={{
            x: particle.vx * 50,
            y: particle.vy * 50,
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{ duration: 2 }}
          onAnimationComplete={() => {
            setParticles((prev) => prev.filter((p) => p.id !== particle.id))
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {currentPage === 0 && (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center min-h-screen relative z-10"
          >
            {/* Enhanced Book Cover */}
            <div className="relative max-w-4xl mx-auto px-4">
              {/* Enhanced Confetti */}
              <div className="absolute inset-0 pointer-events-none">{confetti.map(renderConfettiPiece)}</div>

              {/* Magical balloon string with physics */}
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-lg"
                style={{ height: "250px", zIndex: 1 }}
                animate={balloonPopped ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Enhanced magical balloon */}
              <motion.div
                className="absolute -top-24 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
                onClick={handleBalloonClick}
                animate={balloonPopped ? "popped" : "floating"}
                variants={{
                  floating: {
                    y: [0, -15, 0],
                    rotate: [0, 3, -3, 0],
                    scale: 1,
                  },
                  popped: {
                    scale: [1, 1.5, 0],
                    rotate: [0, 180, 360],
                    opacity: [1, 0.5, 0],
                  },
                }}
                transition={balloonPopped ? { duration: 1 } : { duration: 4, repeat: Number.POSITIVE_INFINITY }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <div
                    className="w-20 h-24 bg-gradient-to-b from-red-400 via-red-500 to-red-600 rounded-full relative shadow-2xl"
                    aria-label="Click the balloon to open your birthday book"
                  >
                    {/* Balloon highlight */}
                    <div className="absolute top-2 left-3 w-4 h-6 bg-gradient-to-br from-white/60 to-transparent rounded-full" />
                    {/* Balloon knot */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-6 border-transparent border-t-red-700" />
                    {/* Magical sparkles on balloon */}
                    <Sparkles className="absolute top-1 right-1 w-4 h-4 text-white animate-pulse" />
                    <Sparkles
                      className="absolute bottom-2 left-1 w-3 h-3 text-yellow-300 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Enhanced glowing name with individual letter animations */}
              <motion.div
                className="text-center relative z-10 mt-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <h1 className="font-playfair font-black text-6xl md:text-8xl lg:text-9xl mb-8 tracking-wider">
                  {"Parity Chizela".split("").map((letter, index) => (
                    <motion.span
                      key={index}
                      className="inline-block animate-rainbow-glow"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        filter: "drop-shadow(0 0 20px currentColor)",
                      }}
                      animate={{
                        y: [0, -10, 0],
                        rotateZ: [0, 2, -2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.1,
                      }}
                      whileHover={{
                        scale: 1.2,
                        rotateZ: 10,
                        transition: { duration: 0.2 },
                      }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </h1>
              </motion.div>

              {/* Enhanced call to action */}
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <motion.p
                  className="text-2xl md:text-3xl text-pink-200 font-dancing font-bold mb-4"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  ✨ Click the magical balloon to open your enchanted book! ✨
                </motion.p>

                <motion.div
                  className="flex justify-center items-center gap-4 mt-6"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Gift className="w-8 h-8 text-yellow-400 animate-pulse" aria-hidden="true" />
                  <span className="text-lg text-white font-poppins">A special surprise awaits...</span>
                  <Gift className="w-8 h-8 text-yellow-400 animate-pulse" aria-hidden="true" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentPage === 1 && (
          <motion.div
            key="card"
            initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            className="flex items-center justify-center min-h-screen p-4 relative z-10"
          >
            <div className="max-w-5xl w-full relative">
              {/* Enhanced floating hearts with varied animations */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    x: [0, Math.sin(i) * 20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1.2, 0.8],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 3,
                    ease: "easeInOut",
                  }}
                >
                  <Heart
                    className="text-pink-400 fill-current"
                    style={{
                      width: `${16 + Math.random() * 16}px`,
                      height: `${16 + Math.random() * 16}px`,
                      filter: "drop-shadow(0 0 10px currentColor)",
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              ))}

              {/* Enhanced magical card with glass morphism */}
              <Card className="magical-border glass-card shadow-2xl relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 animate-gradient-shift" />
                </div>

                {/* Floating sparkles inside card */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 3,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                  </motion.div>
                ))}

                <CardContent className="p-8 md:p-12 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center space-y-8"
                  >
                    {/* Enhanced title */}
                    <motion.h2
                      className="text-4xl md:text-6xl font-playfair font-bold gradient-text mb-8"
                      animate={{
                        textShadow: [
                          "0 0 20px #ff6b9d",
                          "0 0 30px #ffd93d",
                          "0 0 20px #6bcf7f",
                          "0 0 30px #4d9de0",
                          "0 0 20px #ff6b9d",
                        ],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      Happy Birthday, Legend! 🏆
                    </motion.h2>

                    {/* Enhanced story content */}
                    <div className="text-lg md:text-xl text-gray-800 leading-relaxed space-y-6 font-poppins max-w-4xl mx-auto">
                      {[
                        "In a world full of ordinary days, today stands out—because it's yours, Parity!",
                        "Parity Chizela, a man whose energy lifts the room, whose loyalty is unmatched, and whose drive inspires everyone around him.",
                        "May this year bring you new adventures, big wins, and the kind of happiness that lasts all year long.",
                        "You're a real one, a true friend, and a legend in the making. Keep shining, bro! 💪",
                        "Happy Birthday, Parity! 🎂🎉💙",
                      ].map((text, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.5, duration: 0.8 }}
                          className={
                            index === 3
                              ? "text-pink-600 font-bold text-xl md:text-2xl"
                              : index === 4
                                ? "text-2xl md:text-3xl font-bold text-purple-700 font-dancing"
                                : ""
                          }
                        >
                          {text}
                        </motion.p>
                      ))}
                    </div>

                    {/* Download button - simplified for better UX */}
                    <div className="mt-16 flex justify-center">
                      <Button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-4 px-8 rounded-full transform transition-all duration-300 font-poppins text-lg shadow-lg shadow-pink-500/50"
                        // whileHover={{ scale: 1.05 }}
                        // whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-5 h-5 mr-3" />
                        Download Magical Card
                      </Button>
                    </div>

                    {/* Enhanced success modal */}
                    <AnimatePresence>
                      {showDownloadSuccess && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md mx-4 relative overflow-hidden"
                          >
                            {/* Success confetti */}
                            {Array.from({ length: 20 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4d9de0"][
                                    Math.floor(Math.random() * 4)
                                  ],
                                  left: `${Math.random() * 100}%`,
                                  top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                  y: [0, -50, 50],
                                  opacity: [1, 0.5, 0],
                                  scale: [1, 0.5, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  delay: Math.random() * 0.5,
                                }}
                              />
                            ))}

                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              className="mb-6"
                            >
                              <Heart className="w-20 h-20 text-pink-500 mx-auto fill-current" aria-hidden="true" />
                            </motion.div>

                            <motion.h3
                              className="text-3xl font-bold text-gray-800 mb-4 font-playfair"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                              }}
                            >
                              Success! 🎉
                            </motion.h3>

                            <p className="text-gray-600 font-poppins text-lg">
                              Your magical birthday card has been downloaded!
                              <br />
                              <span className="text-pink-600 font-semibold">May all your dreams come true! ✨</span>
                            </p>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
