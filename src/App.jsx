import { useEffect, useRef, useState } from 'react'
import { useClock } from './useClock.js'

const cam = (keys) => JSON.stringify(keys)

const projects = [
  {
    name: 'AIO Wealth Hub',
    summary: 'Personal finance platform with a Rust and SQLite ledger and a React dashboard.',
    stack: 'Rust · SQLite · React · TypeScript',
    pin: 'top',
  },
  {
    name: 'Sattvora Storefront',
    summary: 'React 19 ecommerce storefront with cart, checkout flow and an admin panel.',
    stack: 'React · JavaScript · Tailwind',
    pin: 'middle',
  },
  {
    name: 'DataOps Copilot',
    summary: 'Hackathon build on TrueForge: an agent-assisted data operations copilot.',
    stack: 'TypeScript · SQL · Agents',
    pin: 'bottom',
  },
]

const learning = [
  { name: 'Rust', note: 'Building a shell from scratch, one CodeCrafters stage at a time.' },
  { name: 'Forward-deployed engineering', note: 'Learning the workflow of shipping into customer environments.' },
  { name: 'Java', note: 'Going back through the JVM and Spring Boot patterns.' },
]

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

function Chapter({ number, title, color, len, children }) {
  return (
    <section className="chapter" data-chapter style={{ '--len': len }}>
      <div className="stage">
        <div className="grain" />
        <div className="card timed" style={{ '--a': 0.06, '--b': 0.14, '--c': color }}>
          <span className="card-no">{number}</span>
          <h2>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

export default function App() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()
  useClock(rootRef, !reduced)

  return (
    <div className={`page${reduced ? ' still' : ''}`} ref={rootRef}>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id="wobble" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="2" />
          <feDisplacementMap in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <section className="title-card">
        <div className="paper-stage">
          <div className="grain" />
          <span className="bar bar-blue" />
          <span className="bar bar-red" />
          <span className="bar bar-yellow" />
          <p className="eyebrow">abhishek@github ~ $ whoami</p>
          <h1>Abhishek Thakur</h1>
          <p className="lede">Front-end engineering in React, TypeScript and JavaScript. Learning Rust and forward-deployed engineering in public.</p>
          <p className="scroll-hint">Scroll</p>
        </div>
      </section>

      <Chapter number="01" title="Now" color="#2f6fdb" len={3}>
        <div className="doc timed" style={{ '--a': 0.12, '--b': 0.92 }} data-cam={cam([
          [0.12, 0, 0, 1.25, -2],
          [0.2, 8, 14, 1.55, -1],
          [0.46, -6, 2, 1.5, 0],
          [0.92, 0, 0, 1, 0],
        ])}>
          <p className="doc-line">
            <span className="timed hl" style={{ '--a': 0.2, '--b': 0.3 }}>Working at Limosys</span>, building
            interfaces in React and TypeScript.
          </p>
          <p className="doc-line">
            Backend in{' '}
            <span className="timed ring" style={{ '--a': 0.46, '--b': 0.56 }}>
              Java and Rust
            </span>
            , with Rust in progress.
          </p>
          <p className="doc-line">Next: the devlog, one project at a time.</p>
        </div>
      </Chapter>

      <Chapter number="02" title="Work" color="#d9482b" len={4}>
        <div className="pan timed" style={{ '--a': 0.2, '--b': 0.9 }} data-cam={cam([
          [0.2, 0, 0, 1, 0],
          [0.5, -33.3, 0, 1, 0],
          [0.85, -66.6, 0, 1, 0],
        ])}>
          {projects.map((p, i) => (
            <article className="panel" key={p.name}>
              <img className={`pin pin-${p.pin}`} src="/vox/tape.svg" alt="" />
              <p className="panel-no">0{i + 1}</p>
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <p className="stack">{p.stack}</p>
            </article>
          ))}
        </div>
      </Chapter>

      <Chapter number="03" title="Learning" color="#e8b923" len={3}>
        <ul className="learn">
          {learning.map((l, i) => (
            <li key={l.name} className="timed slap" style={{ '--a': 0.2 + i * 0.18, '--b': 0.34 + i * 0.18, '--r': `${i % 2 ? 2 : -2}deg` }}>
              <strong>{l.name}</strong>
              <span>{l.note}</span>
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter number="04" title="Devlog" color="#2a8a5a" len={2}>
        <div className="doc timed" style={{ '--a': 0.2, '--b': 0.5 }}>
          <p className="doc-line">Short notes on what I learn from each project, in writing first, then video.</p>
          <p className="doc-line">The first entries are on the way.</p>
        </div>
      </Chapter>

      <section className="end-card">
        <div className="paper-stage">
          <div className="grain" />
          <p className="eyebrow">Keep reading</p>
          <nav className="doors">
            <a href="https://github.com/iamabhishekt">GitHub</a>
            <a href="https://linkedin.com/in/iamabhishekt">LinkedIn</a>
            <a href="mailto:abhishekthakur.art@protonmail.com">Email</a>
          </nav>
          <p className="foot">Built with React and Vite. Hosted on GitHub Pages.</p>
        </div>
      </section>
    </div>
  )
}
