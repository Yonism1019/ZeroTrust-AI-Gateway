import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';

const footerLinks = {
  product: {
    title: '产品',
    links: [
      { label: '功能特性', href: '#features' },
      { label: '技术架构', href: '#architecture' },
      { label: '性能指标', href: '#metrics' },
      { label: '产品路线图', href: '#roadmap' },
    ],
  },
  resources: {
    title: '资源',
    links: [
      { label: '技术文档', href: '#' },
      { label: 'API文档', href: '#' },
      { label: '最佳实践', href: '#' },
      { label: '常见问题', href: '#' },
    ],
  },
  company: {
    title: '关于',
    links: [
      { label: '关于我们', href: 'mailto:990908@leapmotor.com' },
      { label: '联系方式', href: 'mailto:990908@leapmotor.com' },

    ],
  },
};

const socialLinks = [
  { icon: Mail, href: 'mailto:990908@leapmotor.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a
              href="#"
              className="flex items-center gap-3 mb-4"
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
            <p className="text-silver text-sm mb-6 max-w-sm">
              AI时代的安全刹车系统。实现AI调用可控、数据流动可见、风险行为可拦截、成本使用可量化。
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-silver hover:text-electric-cyan hover:bg-electric-cyan/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-silver text-sm hover:text-electric-cyan transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-gray text-sm">
            © 2026 零影AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-dark-gray hover:text-electric-cyan transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-dark-gray hover:text-electric-cyan transition-colors">
              服务条款
            </a>
            <a href="#" className="text-dark-gray hover:text-electric-cyan transition-colors">
              Cookie设置
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
