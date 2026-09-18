import { useEffect, useRef, useState } from "react"
import spriteSheet from "@/assets/table-hero-sprite.png"

const FRAME_NATIVE_W = 224
const FRAME_NATIVE_H = 168
const FRAME_COUNT = 6
const DISPLAY_W = 112
const DISPLAY_H = (FRAME_NATIVE_H / FRAME_NATIVE_W) * DISPLAY_W
const SHEET_DISPLAY_W = DISPLAY_W * FRAME_COUNT

type Step = { frame: number; duration: number; bubble?: string }

const SEQUENCE: Step[] = [
  { frame: 0, duration: 700 },
  { frame: 1, duration: 600 },
  { frame: 0, duration: 600 },
  { frame: 1, duration: 600 },
  { frame: 2, duration: 500 },
  { frame: 3, duration: 350, bubble: "Я — Человек-Стол!" },
  { frame: 4, duration: 450 },
  { frame: 5, duration: 2600 },
]

export function TableHeroEasterEgg() {
  const [step, setStep] = useState(0)
  const timeoutRef = useRef<number>()

  useEffect(() => {
    const current = SEQUENCE[step]
    timeoutRef.current = window.setTimeout(() => {
      setStep((s) => (s + 1) % SEQUENCE.length)
    }, current.duration)
    return () => window.clearTimeout(timeoutRef.current)
  }, [step])

  const current = SEQUENCE[step]

  return (
    <div
      className="absolute bottom-2 left-6 md:left-10 select-none pointer-events-none"
      style={{ width: DISPLAY_W, height: DISPLAY_H }}
      aria-hidden="true"
    >
      {current.bubble && (
        <div
          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wide"
          style={{
            background: "#fff",
            color: "#1a130c",
            border: "2px solid #1a130c",
            boxShadow: "2px 2px 0 rgba(0,0,0,0.4)",
          }}
        >
          {current.bubble}
          <span
            className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0"
            style={{
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "7px solid #1a130c",
            }}
          />
        </div>
      )}
      <div
        style={{
          width: DISPLAY_W,
          height: DISPLAY_H,
          backgroundImage: `url(${spriteSheet})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `-${current.frame * DISPLAY_W}px 0`,
          backgroundSize: `${SHEET_DISPLAY_W}px ${DISPLAY_H}px`,
          imageRendering: "pixelated",
        }}
      />
    </div>
  )
}