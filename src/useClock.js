import { useEffect } from 'react'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const smoothstep = (t) => t * t * (3 - 2 * t)

// Interpolate a data-cam keyframe list [p, x, y, scale, rotate] at progress p.
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

// One loop writes one --p per chapter. Motion eases every frame;
// texture (grain and the SVG wobble seed) steps on twos at 12 fps.
export function useClock(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || !enabled) return undefined

    const chapters = [...root.querySelectorAll('[data-chapter]')]
    const state = chapters.map(() => ({ p: 0 }))
    const cams = chapters.map((el) =>
      [...el.querySelectorAll('[data-cam]')].map((node) => ({
        node,
        keys: JSON.parse(node.dataset.cam),
      })),
    )
    const turbulence = root.querySelector('#wobble feTurbulence')
    const phoneMul = () => (window.innerWidth < 640 ? 0.35 : 1)

    let frame = 0
    let last = performance.now()
    let lastTexture = 0
    let raf = 0

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const follow = 1 - Math.exp(-dt * 9)
      const vh = window.innerHeight
      const mul = phoneMul()

      chapters.forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        const range = Math.max(el.offsetHeight - vh, 1)
        const target = clamp(-rect.top / range, 0, 1)
        const s = state[i]
        s.p += (target - s.p) * follow
        if (Math.abs(target - s.p) < 0.0005) s.p = target

        if (Math.abs(parseFloat(el.dataset.lastP || '-1') - s.p) > 0.0005) {
          el.dataset.lastP = String(s.p)
          el.style.setProperty('--p', s.p.toFixed(4))
        }

        cams[i].forEach(({ node, keys }) => {
          const [x, y, scale, rot] = camAt(keys, s.p)
          node.style.transform =
            `translate(${x * mul}%, ${y * mul}%) scale(${1 + (scale - 1) * mul}) rotate(${rot * mul}deg)`
        })
      })

      if (now - lastTexture > 1000 / 12) {
        lastTexture = now
        frame += 1
        if (turbulence) turbulence.setAttribute('seed', String(frame % 7))
        root.style.setProperty('--grain-x', `${(frame * 37) % 240}px`)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [rootRef, enabled])
}
