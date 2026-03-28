<template>
  <!-- Security Stats Grid -->
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <!-- AI Traffic -->
    <div class="stat-card">
      <div class="stat-icon stat-icon-primary">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="stat-label">{{ t('security.aiTraffic') }}</p>
        <p class="stat-value">{{ formatNumber(stats?.ai_traffic || 0) }}</p>
        <p class="stat-trend stat-trend-up">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
          {{ stats?.traffic_growth || 0 }}%
        </p>
      </div>
    </div>

    <!-- Blocked Threats -->
    <div class="stat-card">
      <div class="stat-icon stat-icon-danger">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="stat-label">{{ t('security.blockedThreats') }}</p>
        <p class="stat-value">{{ formatNumber(stats?.blocked_threats || 0) }}</p>
        <p class="stat-trend stat-trend-down">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
          {{ stats?.threat_block_rate || 0 }}% blocked
        </p>
      </div>
    </div>

    <!-- Active Policies -->
    <div class="stat-card">
      <div class="stat-icon stat-icon-success">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="stat-label">{{ t('security.activePolicies') }}</p>
        <p class="stat-value">{{ stats?.active_policies || 0 }}</p>
        <p class="stat-trend stat-trend-up">
          {{ stats?.compliance_rate || 100 }}% compliant
        </p>
      </div>
    </div>

    <!-- Active Models -->
    <div class="stat-card">
      <div class="stat-icon" style="background: rgba(168, 85, 247, 0.2); color: #a855f7;">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 3v1.5M4.5 3v1.5m15 0v1.5m-12-3v1.5M19.5 3v1.5M12 8.25v3.75m-4.5 0h9M12 21v-6.75m0 0h3m-3 0l3-3.75 3 3.75M6.75 15V9m12 6v-1.5m0 0H9m3 0l-3-3.75 3 3.75" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="stat-label">{{ t('security.activeModels') }}</p>
        <p class="stat-value">{{ stats?.active_models || 0 }}</p>
        <p class="stat-trend text-white/50">
          {{ t('security.totalRequests') }}: {{ formatNumber(stats?.total_requests || 0) }}
        </p>
      </div>
    </div>
  </div>

  <!-- Secondary Stats Row -->
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <!-- Data Leakage Prevented -->
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-electric-cyan/20 p-2">
          <svg class="h-5 w-5 text-electric-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-medium text-white/60">{{ t('security.dataLeakagePrevented') }}</p>
          <p class="text-lg font-bold text-electric-cyan">{{ formatNumber(stats?.data_leaks_blocked || 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Shadow AI Detected -->
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-warning-amber/20 p-2">
          <svg class="h-5 w-5 text-warning-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-medium text-white/60">{{ t('security.shadowAIDetected') }}</p>
          <p class="text-lg font-bold text-warning-amber">{{ formatNumber(stats?.shadow_ai_detected || 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Cost Savings -->
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-safe-green/20 p-2">
          <svg class="h-5 w-5 text-safe-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-medium text-white/60">{{ t('security.costSavings') }}</p>
          <p class="text-lg font-bold text-safe-green">${{ formatCost(stats?.cost_savings || 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Risk Events -->
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-danger-red/20 p-2">
          <svg class="h-5 w-5 text-danger-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-medium text-white/60">{{ t('security.riskEvents') }}</p>
          <p class="text-lg font-bold text-danger-red">{{ formatNumber(stats?.risk_events || 0) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface SecurityStats {
  ai_traffic?: number
  traffic_growth?: number
  blocked_threats?: number
  threat_block_rate?: number
  active_policies?: number
  compliance_rate?: number
  active_models?: number
  total_requests?: number
  data_leaks_blocked?: number
  shadow_ai_detected?: number
  cost_savings?: number
  risk_events?: number
}

defineProps<{
  stats: SecurityStats | null
}>()

const { t } = useI18n()

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

const formatCost = (c: number) => c.toFixed(2)
</script>
