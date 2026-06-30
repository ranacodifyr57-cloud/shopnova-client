import { useRef, useEffect, useState } from 'react'

/**
 * Scroll-triggered motion wrapper. Fades + slides its children in
 * the first time they enter the viewport. Dependency-free.
 */
export default function Reveal({ children, delay = 0, y = 26, once = true, style, className, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setShown(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        if (once) io.disconnect()
      } else if (!once) {
        setShown(false)
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.2,0.7,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.2,0.7,0.2,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
