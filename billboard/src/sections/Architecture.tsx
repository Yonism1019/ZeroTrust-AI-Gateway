import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Monitor, 
  Code, 
  Globe, 
  Terminal,
  Cpu,
  Settings,
  Database,
  BarChart3,
  Puzzle,
  Server,
  Cloud,
  Sparkles,
  MessageSquare,
  Bot
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

const architectureLayers = [
  {
    name: '客户端层',
    icon: Monitor,
    color: 'electric-cyan',
    items: [
      { icon: Code, name: 'IDE插件' },
      { icon: Globe, name: '浏览器' },
      { icon: Terminal, name: '命令行' },
      { icon: Puzzle, name: 'SDK' },
    ],
  },
  {
    name: '零影AI网关核心',
    icon: Cpu,
    color: 'neon-purple',
    items: [
      { icon: Server, name: 'API统一入口' },
      { icon: Settings, name: '策略引擎' },
      { icon: Database, name: '缓存层' },
      { icon: BarChart3, name: '监控层' },
      { icon: Terminal, name: '审计日志' },
      { icon: Puzzle, name: '插件系统' },
    ],
  },
  {
    name: '多模型层',
    icon: Cloud,
    color: 'safe-green',
    items: [
      { icon: Sparkles, name: 'OpenAI' },
      { icon: MessageSquare, name: 'Claude' },
      { icon: Bot, name: '百炼' },
      { icon: Bot, name: 'Kimi' },
      { icon: Bot, name: '...' },
    ],
  },
];

const techStack = [
  { category: '网关核心', tech: 'Go', desc: '高性能、低延迟' },
  { category: '策略引擎', tech: 'Go + Python', desc: '性能与生态兼顾' },
  { category: 'NER模型', tech: '轻量BERT/LLaMA', desc: '精度与性能平衡' },
  { category: '缓存', tech: 'Redis', desc: '高性能、支持集群' },
  { category: '数据库', tech: 'PostgreSQL + ClickHouse', desc: '业务与审计分离' },
  { category: '前端', tech: 'Vue3 + Element Plus', desc: '企业级UI' },
];

export function Architecture() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="architecture" className="relative py-24 overflow-hidden">
      {/* Background with neural network */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="/neural-network.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space/95 to-deep-space" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-sm font-medium mb-4">
              系统架构
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              技术
              <span className="text-gradient"> 架构</span>
            </h2>
            <p className="text-silver max-w-2xl mx-auto">
              分层设计，模块化架构，支持灵活扩展和企业级部署
            </p>
          </div>
        </ScrollReveal>

        {/* Architecture Diagram */}
        <div ref={ref} className="mb-16">
          <div className="space-y-8">
            {architectureLayers.map((layer, layerIndex) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, x: layerIndex % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: layerIndex * 0.2 }}
                className="relative"
              >
                {/* Layer Header */}
                <div 
                  className="flex items-center gap-4 mb-4"
                  style={{ 
                    color: layer.color === 'electric-cyan' ? '#00d4ff' :
                           layer.color === 'neon-purple' ? '#8b5cf6' :
                           '#10b981'
                  }}
                >
                  <layer.icon className="w-6 h-6" />
                  <h3 className="text-xl font-bold">{layer.name}</h3>
                </div>

                {/* Layer Items */}
                <div 
                  className="glass rounded-2xl p-6 border"
                  style={{ 
                    borderColor: layer.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.2)' :
                                layer.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.2)' :
                                'rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {layer.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: layerIndex * 0.2 + itemIndex * 0.1 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <item.icon 
                          className="w-6 h-6"
                          style={{ 
                            color: layer.color === 'electric-cyan' ? '#00d4ff' :
                                   layer.color === 'neon-purple' ? '#8b5cf6' :
                                   '#10b981'
                          }}
                        />
                        <span className="text-white text-sm font-medium">{item.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Connection Arrow */}
                {layerIndex < architectureLayers.length - 1 && (
                  <div className="flex justify-center my-4">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={isInView ? { height: 32 } : {}}
                      transition={{ duration: 0.3, delay: layerIndex * 0.2 + 0.3 }}
                      className="w-0.5 bg-gradient-to-b from-electric-cyan to-neon-purple"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <ScrollReveal>
          <div className="glass rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 text-center">技术选型</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-electric-cyan font-bold text-sm">{tech.tech.split(' ')[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{tech.category}</div>
                    <div className="text-silver text-sm">{tech.tech}</div>
                    <div className="text-dark-gray text-xs">{tech.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Data Flow */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 glass rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 text-center">数据流向</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {['用户请求', 'L1检测', 'L2检测', 'AI模型', '响应拦截', '返回用户'].map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-sm font-medium"
                  >
                    {step}
                  </motion.div>
                  {index < 5 && (
                    <div className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-electric-cyan to-neon-purple" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
