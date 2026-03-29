import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Brain, Shield, Sparkles, ArrowRight, Check } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

const strategyLevels = [
  {
    icon: Zap,
    name: 'L1 极速模式',
    phase: 'Pre + 异步Post',
    tech: '正则 + DLP规则库',
    latency: '<1ms',
    color: 'electric-cyan',
    description: '极速正则匹配，命中即拦截',
  },
  {
    icon: Brain,
    name: 'L2 智能模式',
    phase: 'Pre + 异步Post',
    tech: 'NER模型',
    latency: '<10ms',
    color: 'neon-purple',
    description: '轻量BERT检测PII，支持脱敏',
  },
  {
    icon: Shield,
    name: 'L3 深度模式',
    phase: 'Post',
    tech: 'LLM-as-Judge',
    latency: '不阻塞',
    color: 'safe-green',
    description: '安全模型语义风险评估',
  },
  {
    icon: Sparkles,
    name: 'AUTO 智能调度',
    phase: '动态',
    tech: '智能策略调度',
    latency: '最优',
    color: 'yellow-500',
    description: '根据风险评分自动选择策略',
  },
];

const strategyGroups = [
  { name: 'L1单审', pre: ['L1'], post: ['L1'], scene: '普通查询、低风险场景' },
  { name: 'L2单审', pre: ['L2'], post: ['L2'], scene: '含PII数据、需要脱敏' },
  { name: 'L1+L2', pre: ['L1', 'L2'], post: ['L1'], scene: '平衡安全与性能' },
  { name: 'L3深度', pre: ['L1'], post: ['L3'], scene: '高风险操作、代码生成' },
  { name: 'AUTO', pre: ['智能调度'], post: ['动态选择'], scene: '复杂场景、按需升级' },
];

export function StrategyEngine() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-cyan/5 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-sm font-medium mb-4">
              核心创新
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              智能
              <span className="text-gradient"> 策略引擎</span>
            </h2>
            <p className="text-silver max-w-2xl mx-auto">
              按需组合，非串行流水线。能L1解决的不上L2，能异步的不阻塞
            </p>
          </div>
        </ScrollReveal>

        {/* Strategy Levels */}
        <div ref={ref} className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strategyLevels.map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <motion.div
                  className="glass rounded-2xl p-6 border border-white/5 h-full"
                  whileHover={{ 
                    y: -8,
                    borderColor: level.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.3)' :
                                level.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.3)' :
                                level.color === 'safe-green' ? 'rgba(16, 185, 129, 0.3)' :
                                'rgba(234, 179, 8, 0.3)'
                  }}
                >
                  {/* Level Badge */}
                  <div 
                    className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      backgroundColor: level.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.2)' :
                                      level.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.2)' :
                                      level.color === 'safe-green' ? 'rgba(16, 185, 129, 0.2)' :
                                      'rgba(234, 179, 8, 0.2)',
                      color: level.color === 'electric-cyan' ? '#00d4ff' :
                             level.color === 'neon-purple' ? '#8b5cf6' :
                             level.color === 'safe-green' ? '#10b981' :
                             '#eab308'
                    }}
                  >
                    {level.latency}
                  </div>

                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ 
                      backgroundColor: level.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.1)' :
                                      level.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.1)' :
                                      level.color === 'safe-green' ? 'rgba(16, 185, 129, 0.1)' :
                                      'rgba(234, 179, 8, 0.1)'
                    }}
                  >
                    <level.icon 
                      className="w-7 h-7"
                      style={{ 
                        color: level.color === 'electric-cyan' ? '#00d4ff' :
                               level.color === 'neon-purple' ? '#8b5cf6' :
                               level.color === 'safe-green' ? '#10b981' :
                               '#eab308'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2">{level.name}</h3>
                  <p className="text-silver text-sm mb-4">{level.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-dark-gray">执行:</span>
                      <span className="text-white">{level.phase}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-dark-gray">技术:</span>
                      <span className="text-white">{level.tech}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Connection Arrow */}
                {index < strategyLevels.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-white/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Strategy Groups */}
        <ScrollReveal>
          <div className="glass rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 text-center">策略组配置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {strategyGroups.map((group, index) => (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-electric-cyan/30 transition-colors"
                >
                  <h4 className="text-electric-cyan font-semibold mb-2">{group.name}</h4>
                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-dark-gray">Pre:</span>
                      <span className="text-white">{group.pre.join('+')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-dark-gray">Post:</span>
                      <span className="text-white">{group.post.join('+')}</span>
                    </div>
                  </div>
                  <p className="text-silver text-xs">{group.scene}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Key Principle */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-safe-green/10 border border-safe-green/30">
              <Check className="w-5 h-5 text-safe-green" />
              <span className="text-safe-green font-medium">
                核心原则：异步不阻塞，安全灵活两手抓
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
