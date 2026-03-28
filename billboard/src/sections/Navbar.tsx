import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';
import { GlowButton } from '../components/GlowButton';

const navLinks = [
  { label: '产品功能', href: '#features' },
  { label: '技术架构', href: '#architecture' },
  { label: '性能指标', href: '#metrics' },
  { label: '路线图', href: '#roadmap' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-deep-space/90 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-electric-cyan" />
                <div className="absolute inset-0 bg-electric-cyan/30 blur-xl rounded-full" />
              </div>
              <span className="text-xl font-bold text-white">
                零影<span className="text-electric-cyan">AI</span>
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="relative text-silver hover:text-white transition-colors duration-200 text-sm font-medium"
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-electric-cyan"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <GlowButton size="sm">立即体验</GlowButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-deep-space/98 backdrop-blur-xl pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-xl text-white hover:text-electric-cyan transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <GlowButton className="mt-4">立即体验</GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
