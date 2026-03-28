/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ========== 零影AI 深空科技主题 ==========
        // 主背景色
        'deep-space': '#0a0e1a',
        'space-card': '#1a2234',
        'space-dark': '#111827',
        'space-border': 'rgba(255, 255, 255, 0.1)',

        // 主题色 - 电光青
        'electric-cyan': {
          DEFAULT: '#00d4ff',
          50: '#e6faff',
          100: '#ccf5ff',
          200: '#99ebff',
          300: '#66e0ff',
          400: '#33d6ff',
          500: '#00d4ff',
          600: '#00a8cc',
          700: '#007d99',
          800: '#005266',
          900: '#002733'
        },

        // 霓虹紫
        'neon-purple': {
          DEFAULT: '#a855f7',
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6'
        },

        // 安全绿
        'safe-green': {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },

        // 警告橙
        'warning-amber': {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },

        // 危险红
        'danger-red': {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },

        // 兼容旧版primary
        primary: {
          50: '#e6faff',
          100: '#ccf5ff',
          200: '#99ebff',
          300: '#66e0ff',
          400: '#33d6ff',
          500: '#00d4ff',
          600: '#00a8cc',
          700: '#007d99',
          800: '#005266',
          900: '#002733',
          950: '#001a24'
        },

        // 辅助色 - 深蓝灰 (保持兼容)
        accent: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },

        // 深色模式背景 (保持兼容)
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        // 玻璃效果
        glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.06)',
        // 卡片
        card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        // 发光效果
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-cyan-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-purple-lg': '0 0 40px rgba(168, 85, 247, 0.4)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        // 兼容旧版
        glow: '0 0 20px rgba(0, 212, 255, 0.25)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.35)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #007d99 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        'gradient-purple': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a2234 0%, #0a0e1a 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        'mesh-gradient':
          'radial-gradient(at 40% 20%, rgba(0, 212, 255, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(0, 212, 255, 0.08) 0px, transparent 50%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
