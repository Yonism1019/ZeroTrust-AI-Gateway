import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  BarChart3,
  Lock,
  Eye,
  Code,
  AlertOctagon,
  FileText,
  Globe,
  RefreshCw,
  Database,
  Bell,
  Users,
  Cpu,
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

const featureModules = [
  {
    icon: Shield,
    title: '安全能力',
    color: 'electric-cyan',
    features: [
      { icon: Eye, title: '敏感实体识别', desc: 'API Key、数据库、私钥、PII检测' },
      { icon: Lock, title: '智能脱敏', desc: '自动脱敏，不影响AI使用' },
      { icon: Code, title: '代码泄露防护', desc: 'L3深度检测核心代码' },
      { icon: AlertOctagon, title: '风险拦截', desc: '危险指令实时拦截' },
      { icon: FileText, title: 'DLP规则引擎', desc: '可配置的敏感数据防护' },
    ],
  },
  {
    icon: Zap,
    title: '网关能力',
    color: 'neon-purple',
    features: [
      { icon: Globe, title: '统一API出口', desc: '兼容OpenAI/Claude/国产模型' },
      { icon: RefreshCw, title: '多模型热切换', desc: '无感知动态切换' },
      { icon: Database, title: 'Token优化缓存', desc: '节省30%-50%成本' },
    ],
  },
  {
    icon: BarChart3,
    title: '管理能力',
    color: 'safe-green',
    features: [
      { icon: Cpu, title: '实时仪表盘', desc: '调用量/成本/拦截/用户' },
      { icon: FileText, title: '审计日志', desc: '不可篡改，支持导出' },
      { icon: Bell, title: '告警通知', desc: '多渠道实时告警' },
      { icon: Users, title: '行为分析', desc: '多维度使用分析' },
    ],
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-electric-cyan/10 text-electric-cyan text-sm font-medium mb-4">
              核心功能
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              全方位AI流量
              <span className="text-gradient"> 安全防护</span>
            </h2>
            <p className="text-silver max-w-2xl mx-auto">
              从安全检测、网关调度到管理分析，构建完整的AI使用防护体系
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Modules */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featureModules.map((module) => (
            <StaggerItem key={module.title}>
              <motion.div
                className="glass rounded-2xl p-6 border border-white/5 h-full"
                whileHover={{ 
                  y: -8, 
                  borderColor: `rgba(${module.color === 'electric-cyan' ? '0, 212, 255' : module.color === 'neon-purple' ? '139, 92, 246' : '16, 185, 129'}, 0.3)`,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Module Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="p-4 rounded-xl"
                    style={{ 
                      backgroundColor: module.color === 'electric-cyan' ? 'rgba(0, 212, 255, 0.1)' : 
                                      module.color === 'neon-purple' ? 'rgba(139, 92, 246, 0.1)' : 
                                      'rgba(16, 185, 129, 0.1)'
                    }}
                  >
                    <module.icon 
                      className="w-8 h-8"
                      style={{ 
                        color: module.color === 'electric-cyan' ? '#00d4ff' : 
                               module.color === 'neon-purple' ? '#8b5cf6' : 
                               '#10b981'
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{module.title}</h3>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  {module.features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <feature.icon 
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                        style={{ 
                          color: module.color === 'electric-cyan' ? '#00d4ff' : 
                                 module.color === 'neon-purple' ? '#8b5cf6' : 
                                 '#10b981'
                        }}
                      />
                      <div>
                        <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                        <p className="text-silver text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Feature Matrix */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 glass rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 text-center">功能矩阵</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-electric-cyan font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  安全能力
                </h4>
                <ul className="space-y-2 text-silver text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                    敏感实体识别
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                    智能脱敏
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                    代码泄露防护
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                    风险拦截
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                    DLP规则引擎
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-neon-purple font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  网关能力
                </h4>
                <ul className="space-y-2 text-silver text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    统一API出口
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    多模型支持
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    模型热切换
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    负载均衡
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                    本地缓存
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-safe-green font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  管理能力
                </h4>
                <ul className="space-y-2 text-silver text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe-green" />
                    实时仪表盘
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe-green" />
                    成本统计
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe-green" />
                    行为分析
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe-green" />
                    审计日志
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe-green" />
                    告警通知
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
