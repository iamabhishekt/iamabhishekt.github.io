const projects = [
  {
    name: 'AIO Wealth Hub',
    summary: 'Personal finance platform: Rust and SQLite ledger, React dashboard, bank and card connector pipeline.',
    stack: ['Rust', 'SQLite', 'React', 'TypeScript'],
  },
  {
    name: 'Sattvora Storefront',
    summary: 'React 19 ecommerce storefront with cart, checkout flow and an admin panel.',
    stack: ['React', 'JavaScript', 'Tailwind'],
  },
  {
    name: 'DataOps Copilot',
    summary: 'Hackathon project on TrueForge: an agent-assisted data operations copilot.',
    stack: ['TypeScript', 'SQL', 'Agents'],
  },
]

const learning = [
  { name: 'Rust', note: 'Building a shell from scratch on CodeCrafters, one stage at a time.' },
  { name: 'Forward-deployed engineering', note: 'Shipping into customer environments and learning the workflow end to end.' },
  { name: 'Java', note: 'Revisiting the language through the JVM and Spring Boot patterns.' },
]

export default function App() {
  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">abhishek@github ~ $ whoami</p>
        <h1>Abhishek Thakur</h1>
        <p className="lede">
          Working at Limosys, building in React, TypeScript and JavaScript. Learning Rust and
          forward-deployed engineering in public.
        </p>
        <nav className="links">
          <a href="https://github.com/iamabhishekt">GitHub</a>
          <a href="https://linkedin.com/in/iamabhishekt">LinkedIn</a>
          <a href="mailto:abhishekthakur.art@protonmail.com">Email</a>
        </nav>
      </header>

      <section className="section">
        <h2>Work</h2>
        <ul className="projects">
          {projects.map((p) => (
            <li key={p.name}>
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <p className="stack">{p.stack.join(' · ')}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Learning now</h2>
        <ul className="learning">
          {learning.map((l) => (
            <li key={l.name}>
              <strong>{l.name}</strong>
              <span>{l.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Devlog</h2>
        <p className="muted">
          Short video and written notes on what I learn from each project. First entries are on the way.
        </p>
      </section>

      <footer className="foot">
        <p>Built with React and Vite. Hosted on GitHub Pages.</p>
      </footer>
    </main>
  )
}
