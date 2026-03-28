import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { GlowButton } from '../components/GlowButton';
import { ScrollReveal } from '../components/ScrollReveal';

export function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          {/* Icon */}
          <motion.div
            className="relative w-24 h-24 mx-auto mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-electric-cyan/30 blur-3xl rounded-full" />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-electric-cyan/20 to-neon-purple/20 border border-electric-cyan/30 flex items-center justify-center">
              <Shield className="w-12 h-12 text-electric-cyan" />
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            准备好保护您的
            <span className="text-gradient"> AI调用</span>
            了吗？
          </h2>

          {/* Description */}
          <p className="text-lg text-silver mb-10 max-w-2xl mx-auto">
            让每一家企业都能安全地使用AI能力，无需担心数据泄露、影子AI、成本失控等问题
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton size="lg">
              立即体验
              <ArrowRight className="w-5 h-5 ml-2" />
            </GlowButton>
            <GlowButton variant="secondary" size="lg">
              联系我们
            </GlowButton>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-silver text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-safe-green" />
              <span>免费试用</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-safe-green" />
              <span>无需信用卡</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-safe-green" />
              <span>30分钟快速接入</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
