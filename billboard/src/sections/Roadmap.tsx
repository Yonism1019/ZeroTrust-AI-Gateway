import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Rocket, Zap, Shield, Building2, Check, Circle } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

const roadmapPhases = [
  {
    phase: 'Phase 1',
    title: 'MVP参赛版',
    time: '2-3周',
    icon: Rocket,
    color: 'electric-cyan',
    status: 'current',
    features: [
      'API代理（基于sub2api）',
      'L1规则拦截（正则+DLP）',
      '基础日志记录',
      '简单管理后台',
      '单模型支持（OpenAI）',
    ],
    deliverable: '可运行的演示Demo，具备基础安全拦截能力',
  },
  {
    phase: 'Phase 2',
    title: '增强版',
    time: '2-3周',
    icon: Zap,
    color: 'neon-purple',
    status: 'upcoming',
    features: [
      'L2 NER脱敏模型',
      '多模型支持',
      '成本统计报表',
      '告警通知系统',
      '实时仪表盘',
    ],
    deliverable: '智能脱敏 + 多模型 + 成本统计',
  },
  {
    phase: 'Phase 3',
    title: '高级版',
    time: '3-4周',
    icon: Shield,
    color: 'safe-green',
    status: 'upcoming',
    features: [
      'L3 LLM安全判定',
      '代码泄露防护',
      '用户行为分析',
      'AUTO智能策略',
      '完整审计日志系统',
    ],
    deliverable: '深度安全 + 可视化平台 + 实时告警',
  },
  {
    phase: 'Phase 4',
    title: '企业级',
    time: '4-6周',
    icon: Building2,
    color: 'yellow-500',
    status: 'upcoming',
    features: [
      '插件系统（Skills）',
      '用户画像',
      '私有化部署方案',
      '高可用架构',
      'SLA保障体系',
    ],
    deliverable: '插件生态 + 用户画像 + 私有化部署',
  },
];

export function Roadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="roadmap" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-4">
              发展规划
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              产品
              <span className="text-gradient"> 路线图</span>
            </h2>
            <p className="text-silver max-w-2xl mx-auto">
              从MVP到企业级，持续迭代，构建完整的AI安全生态
            </p>
          </div>
        </ScrollReveal>

        {/* Roadmap Timeline */}
        <div ref={ref} className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-electric-cyan via-neon-purple to-safe-green -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {roadmapPhases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="hidden lg:flex absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      phase.status === 'current' ? 'bg-electric-cyan' : 'bg-white/10'
                    }`}
                  >
                    {phase.status === 'current' ? (
                      <div className="w-3 h-3 rounded-full bg-deep-space" />
                    ) : (
                      <Circle className="w-4 h-4 text-white/50" />
                    )}
                  </motion.div>
                </div>

                {/* Card */}
                <motion.div
                  className="glass rounded-2xl p-6 border h-full"
                  style={{ 
                    borderColor: phase.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.3)' :
                                phase.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.3)' :
                                phase.color === 'safe-green' ? 'rgba(16, 185, 129, 0.3)' :
                                'rgba(234, 179, 8, 0.3)'
                  }}
                  whileHover={{ y: -8 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ 
                        backgroundColor: phase.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.1)' :
                                        phase.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.1)' :
                                        phase.color === 'safe-green' ? 'rgba(16, 185, 129, 0.1)' :
                                        'rgba(234, 179, 8, 0.1)'
                      }}
                    >
                      <phase.icon 
                        className="w-6 h-6"
                        style={{ 
                          color: phase.color === 'electric-cyan' ? '#00d4ff' :
                                 phase.color === 'neon-purple' ? '#8b5cf6' :
                                 phase.color === 'safe-green' ? '#10b981' :
                                 '#eab308'
                        }}
                      />
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: phase.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.1)' :
                                        phase.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.1)' :
                                        phase.color === 'safe-green' ? 'rgba(16, 185, 129, 0.1)' :
                                        'rgba(234, 179, 8, 0.1)',
                        color: phase.color === 'electric-cyan' ? '#00d4ff' :
                               phase.color === 'neon-purple' ? '#8b5cf6' :
                               phase.color === 'safe-green' ? '#10b981' :
                               '#eab308'
                      }}
                    >
                      {phase.time}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <span className="text-dark-gray text-sm">{phase.phase}</span>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-4">
                    {phase.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check 
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ 
                            color: phase.color === 'electric-cyan' ? '#00d4ff' :
                                   phase.color === 'neon-purple' ? '#8b5cf6' :
                                   phase.color === 'safe-green' ? '#10b981' :
                                   '#eab308'
                          }}
                        />
                        <span className="text-silver text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Deliverable */}
                  <div 
                    className="p-3 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: phase.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.05)' :
                                      phase.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.05)' :
                                      phase.color === 'safe-green' ? 'rgba(16, 185, 129, 0.05)' :
                                      'rgba(234, 179, 8, 0.05)'
                    }}
                  >
                    <span className="text-dark-gray">交付:</span>{' '}
                    <span className="text-white">{phase.deliverable}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* OKR */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 glass rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 text-center">成功指标 (OKR)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-electric-cyan font-semibold mb-4">O1: 产品价值验证</h4>
                <ul className="space-y-2 text-silver text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                    MVP按期交付
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                    参赛演示成功
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                    核心功能稳定
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-neon-purple font-semibold mb-4">O2: 技术指标达成</h4>
                <ul className="space-y-2 text-silver text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    L1检测延迟 &lt; 1ms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    API延迟 P99 &lt; 100ms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    检测准确率 ≥ 95%
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-safe-green font-semibold mb-4">O3: 用户体验验证</h4>
                <ul className="space-y-2 text-silver text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe-green" />
                    接入时间 &lt; 30分钟
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe-green" />
                    用户满意度 ≥ 4/5
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe-green" />
                    告警准确率 ≥ 90%
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
