import { motion } from 'framer-motion';
import { Zap, Lock, TrendingUp, ChevronDown } from 'lucide-react';
import { GlowButton } from '../components/GlowButton';
import { AnimatedCounter } from '../components/AnimatedCounter';

const stats = [
  { value: 78, suffix: '%', label: '员工使用AI工具', icon: TrendingUp },
  { value: 65, suffix: '%', label: '影子AI场景', icon: Zap },
  { value: 200, suffix: '万+', prefix: '$', label: '平均损失', icon: Lock },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] border border-electric-cyan/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] border border-neon-purple/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] border border-electric-cyan/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-safe-green animate-pulse" />
            <span className="text-sm text-electric-cyan font-medium">企业级AI流量安全网关</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
          >
            <span className="text-white">零影</span>
            <span className="text-gradient">AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6"
          >
            <span className="text-gradient">AI时代的安全刹车系统</span>
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg text-silver max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            所有AI调用，必须经过零影AI<br></br>AI调用可控、数据流动可见、
            风险行为可拦截、成本使用可量化
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <GlowButton size="lg" onClick={() => window.open('http://zeroai.yonism.cn/', '_blank')}>立即体验</GlowButton>
            <GlowButton variant="secondary" size="lg" onClick={() => window.location.href = 'mailto:990908@leapmotor.com'}>
              了解更多
            </GlowButton>
          </motion.div>

          {/* Shield Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="relative w-48 h-48 mx-auto mb-16"
          >
            <div className="absolute inset-0 bg-electric-cyan/20 blur-3xl rounded-full animate-pulse" />
            <img
              src="/shield-hero.png"
              alt="Security Shield"
              className="relative w-full h-full object-contain animate-float"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/10"
              >
                <stat.icon className="w-6 h-6 text-electric-cyan mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-sm text-silver">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-silver">向下滚动</span>
          <ChevronDown className="w-5 h-5 text-electric-cyan" />
        </motion.div>
      </motion.div>
    </section>
  );
}
