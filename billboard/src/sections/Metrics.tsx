import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Clock, 
  Zap, 
  Brain, 
  Users, 
  Activity,
  Target,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';

const performanceMetrics = [
  {
    icon: Clock,
    value: 100,
    suffix: 'ms',
    label: 'API延迟(P99)',
    desc: '策略检查不成为瓶颈',
    color: 'electric-cyan',
  },
  {
    icon: Zap,
    value: 1,
    suffix: 'ms',
    label: 'L1检测延迟',
    desc: '正则匹配极速',
    color: 'electric-cyan',
  },
  {
    icon: Brain,
    value: 50,
    suffix: 'ms',
    label: 'L2检测延迟',
    desc: 'NER模型推理',
    color: 'neon-purple',
  },
  {
    icon: Users,
    value: 1000,
    suffix: '+ QPS',
    label: '并发支持',
    desc: '满足中大型企业需求',
    color: 'safe-green',
  },
  {
    icon: Activity,
    value: 99.9,
    suffix: '%',
    label: '可用性',
    desc: '年故障时间<8.7小时',
    decimals: 1,
    color: 'safe-green',
  },
];

const securityMetrics = [
  {
    icon: Target,
    value: 99,
    suffix: '%',
    label: '检测准确率',
    desc: '行业最高水平',
    color: 'safe-green',
  },
  {
    icon: AlertTriangle,
    value: 3,
    suffix: '%',
    label: '误报率',
    desc: '避免影响正常体验',
    color: 'yellow-500',
  },
  {
    icon: ShieldCheck,
    value: 100,
    suffix: '%',
    label: '拦截成功率',
    desc: '高危风险零放过',
    color: 'safe-green',
  },
];

export function Metrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="metrics" className="relative py-24 overflow-hidden">
      {/* Background with dashboard image */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="/dashboard.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space/95 to-deep-space" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-safe-green/10 text-safe-green text-sm font-medium mb-4">
              性能保障
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              企业级
              <span className="text-gradient-safe"> 性能指标</span>
            </h2>
            <p className="text-silver max-w-2xl mx-auto">
              极致性能与安全的完美平衡，让安全防护不再成为性能瓶颈
            </p>
          </div>
        </ScrollReveal>

        {/* Performance Metrics */}
        <div ref={ref} className="mb-16">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-electric-cyan" />
            性能指标
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-electric-cyan/30 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ 
                    backgroundColor: metric.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.1)' :
                                    metric.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.1)' :
                                    'rgba(16, 185, 129, 0.1)'
                  }}
                >
                  <metric.icon 
                    className="w-6 h-6"
                    style={{ 
                      color: metric.color === 'electric-cyan' ? '#00d4ff' :
                             metric.color === 'neon-purple' ? '#8b5cf6' :
                             '#10b981'
                    }}
                  />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    decimals={metric.decimals || 0}
                  />
                </div>
                <div className="text-white font-medium mb-1">{metric.label}</div>
                <div className="text-silver text-sm">{metric.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Metrics */}
        <ScrollReveal>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-safe-green" />
            安全指标
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {securityMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-safe-green/30 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: metric.color === 'safe-green' ? 'rgba(16, 185, 129, 0.1)' :
                                      'rgba(234, 179, 8, 0.1)'
                    }}
                  >
                    <metric.icon 
                      className="w-6 h-6"
                      style={{ 
                        color: metric.color === 'safe-green' ? '#10b981' : '#eab308'
                      }}
                    />
                  </div>
                  <div 
                    className="text-4xl font-bold"
                    style={{ 
                      color: metric.color === 'safe-green' ? '#10b981' : '#eab308'
                    }}
                  >
                    <AnimatedCounter
                      value={metric.value}
                      suffix={metric.suffix}
                    />
                  </div>
                </div>
                <div className="text-white font-medium mb-1">{metric.label}</div>
                <div className="text-silver text-sm">{metric.desc}</div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Comparison Table */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 glass rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 text-center">策略等级对比</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-silver font-medium">策略等级</th>
                    <th className="text-left py-3 px-4 text-silver font-medium">执行阶段</th>
                    <th className="text-left py-3 px-4 text-silver font-medium">技术实现</th>
                    <th className="text-left py-3 px-4 text-silver font-medium">延迟目标</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">
                      <span className="text-electric-cyan font-semibold">L1 极速模式</span>
                    </td>
                    <td className="py-4 px-4 text-white">Pre + 异步Post</td>
                    <td className="py-4 px-4 text-white">正则 + DLP规则库</td>
                    <td className="py-4 px-4">
                      <span className="text-safe-green font-semibold">&lt;1ms</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">
                      <span className="text-neon-purple font-semibold">L2 智能模式</span>
                    </td>
                    <td className="py-4 px-4 text-white">Pre + 异步Post</td>
                    <td className="py-4 px-4 text-white">NER模型</td>
                    <td className="py-4 px-4">
                      <span className="text-safe-green font-semibold">&lt;10ms</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">
                      <span className="text-safe-green font-semibold">L3 深度模式</span>
                    </td>
                    <td className="py-4 px-4 text-white">Post</td>
                    <td className="py-4 px-4 text-white">LLM-as-Judge</td>
                    <td className="py-4 px-4">
                      <span className="text-safe-green font-semibold">不阻塞</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">
                      <span className="text-yellow-500 font-semibold">AUTO 智能调度</span>
                    </td>
                    <td className="py-4 px-4 text-white">动态</td>
                    <td className="py-4 px-4 text-white">智能策略调度</td>
                    <td className="py-4 px-4">
                      <span className="text-safe-green font-semibold">最优</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
