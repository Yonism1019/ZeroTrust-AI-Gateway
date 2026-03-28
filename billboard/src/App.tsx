import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { PainPoints } from './sections/PainPoints';
import { Features } from './sections/Features';
import { StrategyEngine } from './sections/StrategyEngine';
import { Metrics } from './sections/Metrics';
import { Architecture } from './sections/Architecture';
import { Roadmap } from './sections/Roadmap';
import { CTA } from './sections/CTA';
import { Footer } from './sections/Footer';

function App() {
  return (
    <div className="relative min-h-screen bg-deep-space text-white overflow-x-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <PainPoints />
        <Features />
        <StrategyEngine />
        <Metrics />
        <Architecture />
        <Roadmap />
        <CTA />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
