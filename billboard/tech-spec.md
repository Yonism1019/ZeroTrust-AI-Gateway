# 零影AI宣传网站 - 技术规格文档

---

## 1. 组件清单

### shadcn/ui 组件
| 组件 | 用途 |
|------|------|
| Button | CTA按钮、导航按钮 |
| Card | 功能卡片、痛点卡片 |
| Badge | 标签、状态指示 |
| Separator | 分隔线 |
| Sheet | 移动端导航抽屉 |

### 第三方组件
| 组件 | 来源 | 用途 |
|------|------|------|
| Particles | @magicui/particles | Hero背景粒子效果 |
| Number Ticker | @magicui/number-ticker | 数字滚动动画 |
| Animated Beam | @magicui/animated-beam | 策略引擎连接线 |
| Border Beam | @magicui/border-beam | 卡片边框发光 |

### 自定义组件
| 组件 | 用途 |
|------|------|
| ParticleBackground | 全局粒子背景 |
| AnimatedCounter | 数字滚动计数器 |
| GlowButton | 发光按钮 |
| FeatureCard | 功能展示卡片 |
| PainPointCard | 痛点展示卡片 |
| MetricCard | 性能指标卡片 |
| ArchitectureDiagram | 架构图可视化 |
| RoadmapTimeline | 路线图时间轴 |

---

## 2. 动画实现方案

| 动画效果 | 实现库 | 实现方式 | 复杂度 |
|---------|--------|---------|--------|
| 粒子背景 | @tsparticles/react | 配置粒子参数 | 中 |
| 数字滚动 | @magicui/number-ticker | 组件直接使用 | 低 |
| 滚动触发入场 | Framer Motion | useInView + motion | 中 |
| 标题逐字显示 | Framer Motion | stagger children | 中 |
| 卡片悬停效果 | Framer Motion | whileHover | 低 |
| 按钮发光脉冲 | CSS Animation | @keyframes | 低 |
| 流程线绘制 | SVG + CSS | stroke-dashoffset | 中 |
| 背景光晕呼吸 | CSS Animation | @keyframes | 低 |
| 仪表盘指针 | Framer Motion | rotate animation | 中 |
| 时间轴绘制 | Framer Motion | pathLength | 中 |

---

## 3. 动画库选择

### 主要动画库
- **Framer Motion**: React组件动画、手势、滚动触发
- **@tsparticles/react**: 粒子背景系统
- **@magicui/***: 预构建动画组件

### 辅助动画
- **CSS Animations**: 简单循环动画（脉冲、呼吸）
- **SVG Animations**: 路径绘制、形状变换

---

## 4. 项目文件结构

```
/mnt/okcomputer/output/app/
├── app/
│   ├── sections/
│   │   ├── Navbar.tsx           # 导航栏
│   │   ├── Hero.tsx             # Hero区域
│   │   ├── PainPoints.tsx       # 问题痛点
│   │   ├── Features.tsx         # 核心功能
│   │   ├── StrategyEngine.tsx   # 策略引擎
│   │   ├── Metrics.tsx          # 性能指标
│   │   ├── Architecture.tsx     # 技术架构
│   │   ├── Roadmap.tsx          # 产品路线图
│   │   ├── CTA.tsx              # 行动号召
│   │   └── Footer.tsx           # 页脚
│   ├── components/
│   │   ├── ParticleBackground.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── GlowButton.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── PainPointCard.tsx
│   │   ├── MetricCard.tsx
│   │   ├── SectionTitle.tsx
│   │   └── ScrollReveal.tsx
│   ├── hooks/
│   │   └── useScrollReveal.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── page.tsx                 # 主页面
│   ├── layout.tsx               # 根布局
│   └── globals.css              # 全局样式
├── components/
│   └── ui/                      # shadcn/ui组件
├── public/
│   └── images/                  # 图片资源
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 5. 依赖列表

### 核心依赖
```bash
# 动画库
npm install framer-motion

# 粒子背景
npm install @tsparticles/react @tsparticles/slim

# 图标
npm install lucide-react

# 工具
npm install clsx tailwind-merge
```

### shadcn/ui 组件
```bash
npx shadcn add button card badge separator sheet
```

### MagicUI 组件
```bash
npx shadcn add @magicui/particles
npx shadcn add @magicui/number-ticker
npx shadcn add @magicui/animated-beam
npx shadcn add @magicui/border-beam
```

---

## 6. 关键技术实现

### 粒子背景配置
```typescript
const particlesConfig = {
  fullScreen: { enable: false },
  particles: {
    number: { value: 80 },
    color: { value: "#00d4ff" },
    size: { value: { min: 1, max: 3 } },
    move: {
      enable: true,
      speed: { min: 0.2, max: 0.8 },
    },
    links: {
      enable: true,
      distance: 150,
      color: "#00d4ff",
      opacity: 0.15,
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
    },
  },
};
```

### 滚动触发动画
```typescript
const scrollRevealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
```

### 数字滚动动画
```typescript
// 使用 @magicui/number-ticker
<NumberTicker
  value={100}
  className="text-5xl font-bold"
  suffix="ms"
/>
```

---

## 7. 性能优化策略

1. **图片优化**
   - 使用 Next.js Image 组件
   - 懒加载非首屏图片
   - 使用 WebP 格式

2. **动画优化**
   - 使用 transform 和 opacity
   - 添加 will-change 提示
   - 支持 prefers-reduced-motion

3. **代码优化**
   - 组件懒加载
   - 动态导入大型库
   - Tree shaking

4. **字体优化**
   - 使用 next/font
   - 字体预加载
   - 字体子集化

---

## 8. 响应式断点

```typescript
// Tailwind 配置
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

---

## 9. 颜色配置

```typescript
// Tailwind 扩展
colors: {
  'deep-space': '#050508',
  'ink-blue': '#0a0a12',
  'indigo-dark': '#12121f',
  'electric-cyan': '#00d4ff',
  'neon-purple': '#8b5cf6',
  'alert-red': '#ef4444',
  'safe-green': '#10b981',
  'silver': '#a1a1aa',
  'dark-gray': '#71717a',
}
```
