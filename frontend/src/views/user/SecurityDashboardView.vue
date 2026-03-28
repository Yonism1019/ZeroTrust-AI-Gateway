<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>

      <template v-else>
        <!-- Security Stats -->
        <SecurityDashboardStats :stats="securityStats" />

        <!-- Security Overview Grid -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Threat Activity Chart -->
          <div class="lg:col-span-2">
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-semibold text-white">{{ t('security.threatActivity') }}</h3>
              </div>
              <div class="card-body">
                <div class="h-64 flex items-center justify-center text-white/40">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-electric-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                    <p class="mt-2">{{ t('security.chartPlaceholder') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Alerts -->
          <div class="lg:col-span-1">
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-semibold text-white">{{ t('security.recentAlerts') }}</h3>
              </div>
              <div class="card-body">
                <div class="space-y-3">
                  <div v-for="alert in recentAlerts" :key="alert.id" class="flex items-start gap-3 rounded-lg bg-deep-space p-3">
                    <div :class="getAlertIconClass(alert.level)" class="mt-0.5">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-white truncate">{{ alert.title }}</p>
                      <p class="text-xs text-white/50">{{ alert.time }}</p>
                    </div>
                  </div>

                  <div v-if="recentAlerts.length === 0" class="text-center text-white/40 py-4">
                    <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    <p class="mt-1 text-sm">{{ t('security.noAlerts') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Policy Overview -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-white">{{ t('security.policyOverview') }}</h3>
            </div>
            <div class="card-body">
              <div class="space-y-4">
                <div v-for="policy in policies" :key="policy.name" class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div :class="policy.status === 'active' ? 'bg-safe-green/20 text-safe-green' : 'bg-warning-amber/20 text-warning-amber'" class="rounded-lg p-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white">{{ policy.name }}</p>
                      <p class="text-xs text-white/50">{{ policy.description }}</p>
                    </div>
                  </div>
                  <span :class="policy.status === 'active' ? 'badge-success' : 'badge-warning'" class="badge">
                    {{ policy.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Model Distribution -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-white">{{ t('security.modelDistribution') }}</h3>
            </div>
            <div class="card-body">
              <div class="space-y-3">
                <div v-for="model in modelDistribution" :key="model.name" class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="h-2 w-2 rounded-full bg-electric-cyan"></div>
                    <span class="text-sm text-white/80">{{ model.name }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-24 h-2 rounded-full bg-space-dark overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-electric-cyan to-neon-purple rounded-full" :style="{ width: model.percentage + '%' }"></div>
                    </div>
                    <span class="text-xs text-white/50 w-12 text-right">{{ model.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SecurityDashboardStats from '@/components/user/dashboard/SecurityDashboardStats.vue'

const { t } = useI18n()

const loading = ref(false)

// Mock security stats
const securityStats = ref({
  ai_traffic: 125847,
  traffic_growth: 12.5,
  blocked_threats: 234,
  threat_block_rate: 99.2,
  active_policies: 8,
  compliance_rate: 98.5,
  active_models: 12,
  total_requests: 1024532,
  data_leaks_blocked: 45,
  shadow_ai_detected: 7,
  cost_savings: 12580.50,
  risk_events: 3
})

const recentAlerts = ref([
  { id: 1, title: 'Shadow AI detected: Unauthorized ChatGPT usage', level: 'warning', time: '2 min ago' },
  { id: 2, title: 'Data leak attempt blocked in channel #ai-requests', level: 'danger', time: '15 min ago' },
  { id: 3, title: 'Policy violation: Rate limit exceeded for user admin@company.com', level: 'info', time: '1 hour ago' }
])

const policies = ref([
  { name: 'Data Loss Prevention', description: 'Blocks sensitive data in AI requests', status: 'active' },
  { name: 'Shadow AI Control', description: 'Detects unauthorized AI tools', status: 'active' },
  { name: 'Cost Control', description: 'Monthly spending limits per user', status: 'active' },
  { name: 'Content Filter', description: 'Blocks harmful content', status: 'active' }
])

const modelDistribution = ref([
  { name: 'GPT-4', percentage: 45 },
  { name: 'Claude 3', percentage: 28 },
  { name: 'Gemini Pro', percentage: 15 },
  { name: 'Others', percentage: 12 }
])

function getAlertIconClass(level: string) {
  switch (level) {
    case 'danger':
      return 'text-danger-red'
    case 'warning':
      return 'text-warning-amber'
    default:
      return 'text-electric-cyan'
  }
}

onMounted(() => {
  // In production, load real security stats here
})
</script>
