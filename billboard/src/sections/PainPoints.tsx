import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  EyeOff, 
  DollarSign, 
  ShieldAlert, 
  FileWarning,
  Code,
  Key,
  Terminal,
  Scale
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

const painPoints = [
  {
    icon: AlertTriangle,
    title: '数据泄露',
    description: '员工将代码、API Key、数据库配置直接输入AI',
    severity: '极高',
    color: 'alert-red',
  },
  {
    icon: EyeOff,
    title: '影子AI',
    description: '无法管控员工私自接入的第三方大模型',
    severity: '极高',
    color: 'alert-red',
  },
  {
    icon: DollarSign,
    title: '成本失控',
    description: 'AI调用成本无法统计、无法控制',
    severity: '高',
    color: 'yellow-500',
  },
  {
    icon: ShieldAlert,
    title: '风险行为',
    description: 'AI生成不安全指令未被拦截',
    severity: '极高',
    color: 'alert-red',
  },
  {
    icon: FileWarning,
    title: '审计缺失',
    description: '无完整的AI行为日志，无法满足合规要求',
    severity: '高',
    color: 'yellow-500',
  },
];

const riskCases = [
  {
    icon: Code,
    title: '代码泄露',
    description: '国际AI顶尖公司泄露最新模型代码，导致核心算法泄露至第三方服务器',
  },
  {
    icon: Key,
    title: '密钥外泄',
    description: '员工将生产环境数据库连接字符串粘贴至AI询问，数据库凭证暴露',
  },
  {
    icon: Terminal,
    title: '破坏性指令',
    description: 'AI返回包含 rm -rf / 的命令未被拦截，导致正式环境数据被误删，宕机超13小时',
  },
  {
    icon: Scale,
    title: '合规违规',
    description: '金融公司使用AI处理客户数据，未做审计日志，触发监管处罚',
  },
];

export function PainPoints() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-alert-red/5 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-alert-red/10 text-alert-red text-sm font-medium mb-4">
              严峻挑战
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              企业AI使用面临
              <span className="text-gradient-danger"> 严峻挑战</span>
            </h2>
            <p className="text-silver max-w-2xl mx-auto">
              AI大模型正在全面渗透企业，但安全风险也随之而来
            </p>
          </div>
        </ScrollReveal>

        {/* Pain Points Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {painPoints.map((point) => (
            <StaggerItem key={point.title}>
              <motion.div
                className="relative glass rounded-2xl p-6 border-l-4 h-full"
                style={{ borderLeftColor: point.color === 'alert-red' ? '#ef4444' : '#eab308' }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-${point.color}/10`}>
                    <point.icon className={`w-6 h-6 text-${point.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{point.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${point.color}/20 text-${point.color}`}>
                        {point.severity}
                      </span>
                    </div>
                    <p className="text-silver text-sm">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Risk Cases */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">典型风险事件</h3>
            <p className="text-silver">真实案例警示</p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {riskCases.map((risk) => (
            <StaggerItem key={risk.title}>
              <motion.div
                className="glass rounded-2xl p-6 border border-white/5 hover:border-alert-red/30 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-alert-red/10">
                    <risk.icon className="w-6 h-6 text-alert-red" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{risk.title}</h4>
                    <p className="text-silver text-sm leading-relaxed">{risk.description}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
