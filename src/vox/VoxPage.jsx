import { useEffect, useRef, useState } from 'react'
import { useClock } from './useClock.js'
import content from './data/content.json'
import './vox.css'

const { stats, build, learn, links, home, now } = content

const cam = (keys) => JSON.stringify(keys)
const win = (a, b, extra) => ({ '--a': a, '--b': b, ...extra })

// Starts false so the server render matches; the browser corrects it on mount.
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

function Mark({ a, b, children }) {
  return (
    <mark className="k hl" style={win(a, b)}>
      {children}
    </mark>
  )
}

function Ring({ a, b, children }) {
  return (
    <span className="k ring" style={win(a, b)}>
      {children}
    </span>
  )
}

function Slap({ a, b, r = 0, className = '', style, children }) {
  return (
    <div className={`k slap ${className}`} style={win(a, b, { '--r': `${r}deg`, ...style })}>
      {children}
    </div>
  )
}

function Chapter({ n, title, color, len, children }) {
  return (
    <section className="chapter" data-chapter style={{ '--len': len, '--c': color }}>
      <div className="stage">
        <div className="k card" style={win(0.06, 0.14)}>
          <span className="card-n">{n}</span>
          <h2 className="card-title">{title}</h2>
          <span className="torn card-edge" aria-hidden="true" />
        </div>
        {children}
        <div className="grain" aria-hidden="true" />
      </div>
    </section>
  )
}

function TitleCard() {
  return (
    <header className="title">
      <span className="torn bar" style={{ '--c': links[0].color, top: '7%' }} aria-hidden="true" />
      <span className="torn bar" style={{ '--c': links[1].color, top: '82%', left: '38%' }} aria-hidden="true" />
      <span className="torn bar" style={{ '--c': links[2].color, top: '92%', right: '45%' }} aria-hidden="true" />
      <div className="title-copy">
        <p className="kicker">An explainer in three chapters</p>
        <h1>
          Abhishek
          <br />
          Thakur
        </h1>
        <p className="lede">{content.tagline}</p>
        <p className="scroll-cue">
          Scroll to play &middot; <a href="/blog/">Read the devlog</a>
        </p>
      </div>
      <figure className="cutout">
        <img src="/vox/cutout.webp" alt="Abhishek Thakur as a halftone newspaper cut-out" width="900" height="891" />
        <img className="tape tape-head" src="/vox/tape-1.webp" alt="" />
        <img className="tape tape-shoulder" src="/vox/tape-2.webp" alt="" />
      </figure>
      <div className="grain" aria-hidden="true" />
    </header>
  )
}

function NumbersChapter() {
  return (
    <Chapter n="01" title="The numbers" color="#2f5fd0" len={4}>
      <div
        className="cam"
        data-cam={cam([
          [0.12, 0, 0, 1.2, -2],
          [0.22, 6, 17, 1.45, -1],
          [0.4, -4, 1, 1.45, 0],
          [0.6, -2, -15, 1.45, 1],
          [0.82, 0, 0, 1, 0],
        ])}
      >
        <article className="sheet">
          <p className="sheet-head">File 01 &middot; {content.handle}</p>
          <p className="line">
            I&rsquo;m from {home.city}, working in {now.place.split(',')[0]}:{' '}
            <Mark a={0.22} b={0.32}>{stats.kmFromHome} km from home</Mark>.
          </p>
          <p className="line">
            By day at Limosys, I build interfaces in <Mark a={0.42} b={0.52}>React and TypeScript</Mark>.
          </p>
          <p className="line">
            After hours, a shell in Rust: <Ring a={0.62} b={0.72}>{stats.shellStages}</Ring> stages to go.
          </p>
        </article>
      </div>
    </Chapter>
  )
}

const PANEL_START = [0.16, 0.46, 0.76]

function BuildChapter() {
  return (
    <Chapter n="02" title="What I build" color="#d6402a" len={5}>
      <div
        className="track"
        data-pan
        data-cam={cam([
          [0.14, 0, 0, 1, 0],
          [0.36, 0, 0, 1, 0],
          [0.44, -33.3333, 0, 1, 0],
          [0.66, -33.3333, 0, 1, 0],
          [0.74, -66.6667, 0, 1, 0],
          [1, -66.6667, 0, 1, 0],
        ])}
      >
        {build.map((item, i) => {
          const t0 = PANEL_START[i]
          return (
            <div className="panel" key={item.name}>
              <p className="panel-label">{item.label}</p>
              <div className="panel-body">
                {item.shot ? (
                  <Slap a={t0} b={t0 + 0.06} r={-2} className="shot">
                    <a href={item.href}>
                      <img src={item.shot} alt={`${item.name} home page`} width="1100" height="688" />
                    </a>
                    <img className="tape tape-a" src="/vox/tape-3.webp" alt="" />
                    <img className="tape tape-b" src="/vox/tape-1.webp" alt="" />
                  </Slap>
                ) : (
                  <Slap a={t0} b={t0 + 0.06} r={-1.5} className="clipping">
                    <p className="clip-kicker">Case file</p>
                    <p className="clip-name">{item.name}</p>
                    <p className="clip-stack">{item.stack}</p>
                    <img className="tape tape-a" src="/vox/tape-2.webp" alt="" />
                  </Slap>
                )}
                <Slap a={t0 + 0.05} b={t0 + 0.1} r={2} className="note">
                  <img className="pin" src="/vox/pin.webp" alt="" />
                  <h3>{item.name}</h3>
                  <p>{item.summary}</p>
                  {item.shot && <p className="note-stack">{item.stack}</p>}
                </Slap>
                <Slap a={t0 + 0.1} b={t0 + 0.15} r={-4} className="stat">
                  {item.stat}
                </Slap>
              </div>
            </div>
          )
        })}
      </div>
    </Chapter>
  )
}

function LearnChapter() {
  return (
    <Chapter n="03" title="What I'm learning" color="#e3b021" len={4}>
      <div
        className="cam"
        data-cam={cam([
          [0.12, 0, 0, 1.15, 1],
          [0.28, 4, 2, 1.3, 0],
          [0.6, -3, 0, 1.15, -1],
          [0.86, 0, 0, 1, 0],
        ])}
      >
        <figure className="map">
          <img src="/vox/map.webp" alt="Printed map of South Asia" width="1200" height="900" />
          <img className="tape tape-a" src="/vox/tape-3.webp" alt="" />
          <Slap a={0.2} b={0.28} className="map-pin" style={home.pin}>
            <img src="/vox/pin.webp" alt="" />
          </Slap>
          <Slap a={0.24} b={0.32} r={-3} className="map-tag" style={home.pin}>
            Home: {home.city}
          </Slap>
          <Slap a={0.68} b={0.76} className="ink-arrow" />
          <Slap a={0.72} b={0.8} r={2} className="map-now">
            Now: {now.place}, {now.why}
          </Slap>
        </figure>
        <div className="learn">
          {learn.map((item, i) => (
            <Slap key={item.name} a={0.32 + i * 0.12} b={0.4 + i * 0.12} r={i % 2 ? 2 : -2} className="learn-card">
              <strong>{item.name}</strong>
              <span>{item.note}</span>
            </Slap>
          ))}
        </div>
      </div>
    </Chapter>
  )
}

function EndCard() {
  return (
    <footer className="end">
      <div className="end-copy">
        <p className="kicker">Next chapter</p>
        <h2>A devlog of what each project teaches me, in writing first, then video.</h2>
        <nav className="doors" aria-label="Devlog and contact">
          <a className="torn door" style={{ '--c': '#1b1915' }} href="/blog/">
            Devlog
          </a>
          {links.map((link) => (
            <a key={link.label} className="torn door" style={{ '--c': link.color }} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="credit">Paper, ink and halftone drawn in code. React and plain CSS, no animation library.</p>
      </div>
      <div className="grain" aria-hidden="true" />
    </footer>
  )
}

export default function App() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()
  useClock(rootRef, !reduced)

  return (
    <div className={reduced ? 'page still' : 'page'} ref={rootRef}>
      <svg className="defs" aria-hidden="true">
        <filter id="wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="1" />
          <feDisplacementMap in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <TitleCard />
      <main>
        <NumbersChapter />
        <BuildChapter />
        <LearnChapter />
      </main>
      <EndCard />
    </div>
  )
}
