import { useEffect } from 'react'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const smoothstep = (t) => t * t * (3 - 2 * t)

// Interpolate data-cam keyframes [p, x%, y%, scale, rotate] at progress p.
export function camAt(keys, p) {
  if (p <= keys[0][0]) return keys[0].slice(1)
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, ...v0] = keys[i]
    const [p1, ...v1] = keys[i + 1]
    if (p <= p1) {
      const k = smoothstep((p - p0) / (p1 - p0))
      return v0.map((a, j) => a + (v1[j] - a) * k)
    }
  }
  return keys[keys.length - 1].slice(1)
}

function camTransform(node, keys, p, phone) {
  const [x, y, scale, rot] = camAt(keys, p)
  // Phones get a gentler camera; whole-panel pans keep their full travel.
  const m = phone && !node.hasAttribute('data-pan') ? 0.35 : 1
  return `translate(${(x * m).toFixed(3)}%, ${(y * m).toFixed(3)}%) scale(${(1 + (scale - 1) * m).toFixed(4)}) rotate(${(rot * m).toFixed(3)}deg)`
}

// One loop, one --p per chapter. Motion eases every frame; texture
// (grain offset and the ink wobble seed) steps on twos at 12 fps.
export function useClock(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || !enabled) return undefined

    const beats = [...root.querySelectorAll('[data-chapter]')].map((el) => ({
      el,
      p: 0,
      written: -1,
      cams: [...el.querySelectorAll('[data-cam]')].map((node) => ({
        node,
        keys: JSON.parse(node.dataset.cam),
        css: '',
      })),
    }))
    const turbulence = root.querySelector('#wobble feTurbulence')

    let frame = 0
    let last = performance.now()
    let lastTexture = 0
    let raf = 0

    const write = (beat, phone) => {
      if (beat.p === beat.written) return
      beat.written = beat.p
      beat.el.style.setProperty('--p', beat.p.toFixed(4))
      for (const cam of beat.cams) {
        const css = camTransform(cam.node, cam.keys, beat.p, phone)
        if (css !== cam.css) {
          cam.css = css
          cam.node.style.transform = css
        }
      }
    }

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const follow = 1 - Math.exp(-dt * 9)
      const vh = window.innerHeight
      const phone = window.innerWidth < 640

      for (const beat of beats) {
        const rect = beat.el.getBoundingClientRect()
        const target = clamp(-rect.top / Math.max(rect.height - vh, 1), 0, 1)
        if (rect.bottom < -vh || rect.top > vh * 2) {
          // More than a screen away: settle without animating.
          beat.p = target
        } else {
          beat.p += (target - beat.p) * follow
          if (Math.abs(target - beat.p) < 0.0004) beat.p = target
        }
        write(beat, phone)
      }

      if (now - lastTexture > 1000 / 12) {
        lastTexture = now
        frame += 1
        if (turbulence && frame % 2 === 0) turbulence.setAttribute('seed', String(frame % 7))
        root.style.setProperty('--grain-x', `${(frame * 37) % 240}px`)
      }

      raf = requestAnimationFrame(tick)
    }

    // Crossing the phone breakpoint changes the camera, so force a rewrite.
    const onResize = () => {
      for (const beat of beats) beat.written = -1
    }

    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [rootRef, enabled])
}
