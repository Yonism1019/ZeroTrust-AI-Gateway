<template>
  <AppLayout>
    <TablePageLayout>
      <template #filters>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Left: Filters -->
          <div class="flex flex-1 flex-wrap items-center gap-2">
            <Select
              v-model="filters.severity"
              :options="severityOptions"
              class="w-32"
              :placeholder="t('admin.security.events.severity')"
              @change="handleFilterChange"
            />
            <Select
              v-model="filters.status"
              :options="statusOptions"
              class="w-32"
              :placeholder="t('admin.security.events.status')"
              @change="handleFilterChange"
            />
            <Select
              v-model="filters.category"
              :options="categoryOptions"
              class="w-40"
              :placeholder="t('admin.security.events.category')"
              @change="handleFilterChange"
            />
          </div>

          <!-- Right: Action buttons -->
          <div class="flex flex-wrap items-center justify-end gap-2">
            <button
              @click="loadEvents"
              :disabled="loading"
              class="btn btn-secondary"
              :title="t('common.refresh')"
            >
              <Icon name="refresh" size="md" :class="loading ? 'animate-spin' : ''" />
            </button>
          </div>
        </div>
      </template>

      <template #table>
        <DataTable :columns="columns" :data="events" :loading="loading">
          <template #cell-severity="{ value }">
            <span
              :class="[
                'badge',
                severityBadgeClass(value)
              ]"
            >
              {{ value }}
            </span>
          </template>

          <template #cell-eventType="{ value }">
            <span class="badge badge-info">{{ value }}</span>
          </template>

          <template #cell-status="{ value }">
            <span
              :class="[
                'badge',
                statusBadgeClass(value)
              ]"
            >
              {{ value }}
            </span>
          </template>

          <template #cell-title="{ value, row }">
            <div class="min-w-0">
              <div class="truncate font-medium text-gray-900 dark:text-white">{{ value }}</div>
              <div class="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-dark-400">
                <span>#{{ row.id }}</span>
                <span class="text-gray-300 dark:text-dark-700">·</span>
                <span>{{ row.category }}</span>
                <span class="text-gray-300 dark:text-dark-700">·</span>
                <span>{{ formatDateTime(row.created_at) }}</span>
              </div>
            </div>
          </template>

          <template #cell-action="{ value }">
            <span
              :class="[
                'badge',
                actionBadgeClass(value)
              ]"
            >
              {{ value }}
            </span>
          </template>

          <template #cell-confidence="{ value }">
            <div class="flex items-center gap-2">
              <div class="w-16 h-1.5 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :class="confidenceBarClass(value)"
                  :style="{ width: `${Math.round(value * 100)}%` }"
                />
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ Math.round(value * 100) }}%</span>
            </div>
          </template>

          <template #cell-sourceIp="{ row }">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ row.source_ip || '-' }}
            </span>
          </template>

          <template #cell-actions="{ row }">
            <div class="flex items-center space-x-1">
              <button
                @click="openDetailDialog(row)"
                class="flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                :title="t('common.view')"
              >
                <Icon name="eye" size="sm" />
              </button>
              <button
                v-if="row.status === 'new'"
                @click="openResolveDialog(row)"
                class="flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                :title="t('admin.security.events.resolve')"
              >
                <Icon name="check" size="sm" />
              </button>
            </div>
          </template>

          <template #empty>
            <EmptyState
              :title="t('empty.noData')"
              :description="t('admin.security.events.failedToLoad')"
              @action="loadEvents"
            />
          </template>
        </DataTable>
      </template>

      <template #pagination>
        <Pagination
          v-if="pagination.total > 0"
          :page="pagination.page"
          :total="pagination.total"
          :page-size="pagination.page_size"
          @update:page="handlePageChange"
        />
      </template>
    </TablePageLayout>

    <!-- Detail Dialog -->
    <BaseDialog :show="showDetailDialog" :title="t('admin.security.events.eventDetail')" width="normal" @close="showDetailDialog = false">
      <div v-if="selectedEvent" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.id') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">#{{ selectedEvent.id }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.severity') }}</label>
            <p class="mt-1">
              <span :class="['badge', severityBadgeClass(selectedEvent.severity)]">
                {{ selectedEvent.severity }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.eventType') }}</label>
            <p class="mt-1">
              <span class="badge badge-info">{{ selectedEvent.event_type }}</span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.status') }}</label>
            <p class="mt-1">
              <span :class="['badge', statusBadgeClass(selectedEvent.status)]">
                {{ selectedEvent.status }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.action') }}</label>
            <p class="mt-1">
              <span :class="['badge', actionBadgeClass(selectedEvent.action)]">
                {{ selectedEvent.action }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.confidence') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ Math.round(selectedEvent.confidence * 100) }}%</p>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.title') }}</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedEvent.title }}</p>
        </div>

        <div v-if="selectedEvent.description">
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.description') }}</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedEvent.description }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.category') }}</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedEvent.category }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.sourceIp') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedEvent.source_ip || '-' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.userAgent') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white truncate">{{ selectedEvent.user_agent || '-' }}</p>
          </div>
        </div>

        <div v-if="selectedEvent.matched_patterns">
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.matchedPatterns') }}</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedEvent.matched_patterns }}</p>
        </div>

        <div v-if="selectedEvent.request_snapshot">
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.requestSnapshot') }}</label>
          <pre class="mt-1 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-dark-700">{{ selectedEvent.request_snapshot }}</pre>
        </div>

        <div v-if="selectedEvent.resolution">
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.resolution') }}</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedEvent.resolution }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.createdAt') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDateTime(selectedEvent.created_at) }}</p>
          </div>
          <div v-if="selectedEvent.resolved_at">
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.events.resolvedAt') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDateTime(selectedEvent.resolved_at) }}</p>
          </div>
        </div>
      </div>
    </BaseDialog>

    <!-- Resolve Dialog -->
    <BaseDialog :show="showResolveDialog" :title="t('admin.security.events.resolveEvent')" width="narrow" @close="showResolveDialog = false">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-200">
            {{ t('admin.security.events.status') }}
          </label>
          <Select
            v-model="resolveForm.status"
            :options="resolveStatusOptions"
            class="mt-1 w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-200">
            {{ t('admin.security.events.resolution') }}
          </label>
          <textarea
            v-model="resolveForm.resolution"
            rows="3"
            class="mt-1 input w-full"
            :placeholder="t('admin.security.events.resolutionPlaceholder')"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showResolveDialog = false" class="btn btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button @click="handleResolve" :disabled="resolving" class="btn btn-primary">
            {{ resolving ? t('common.submitting') : t('common.submit') }}
          </button>
        </div>
      </template>
    </BaseDialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import securityAPI, { type SecurityEvent } from '@/api/security'
import { formatDateTime } from '@/utils/format'
import AppLayout from '@/components/layout/AppLayout.vue'
import TablePageLayout from '@/components/layout/TablePageLayout.vue'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
import Select from '@/components/common/Select.vue'
import Icon from '@/components/icons/Icon.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const { t } = useI18n()

const loading = ref(false)
const resolving = ref(false)
const events = ref<SecurityEvent[]>([])
const pagination = ref({
  page: 1,
  page_size: 20,
  total: 0
})

const filters = reactive({
  severity: '',
  status: '',
  category: ''
})

const showDetailDialog = ref(false)
const showResolveDialog = ref(false)
const selectedEvent = ref<SecurityEvent | null>(null)

const resolveForm = reactive({
  status: 'resolved',
  resolution: ''
})

const columns = computed(() => [
  { key: 'title', label: t('admin.security.events.title'), width: '25%' },
  { key: 'severity', label: t('admin.security.events.severity'), width: '10%' },
  { key: 'eventType', label: t('admin.security.events.eventType'), width: '12%' },
  { key: 'status', label: t('admin.security.events.status'), width: '10%' },
  { key: 'action', label: t('admin.security.events.action'), width: '10%' },
  { key: 'confidence', label: t('admin.security.events.confidence'), width: '13%' },
  { key: 'sourceIp', label: t('admin.security.events.sourceIp'), width: '15%' },
  { key: 'actions', label: t('common.actions'), width: '5%', sortable: false }
])

const severityOptions = computed(() => [
  { value: '', label: t('admin.security.events.allSeverities') },
  { value: 'critical', label: t('admin.security.events.severityCritical') },
  { value: 'high', label: t('admin.security.events.severityHigh') },
  { value: 'medium', label: t('admin.security.events.severityMedium') },
  { value: 'low', label: t('admin.security.events.severityLow') },
  { value: 'info', label: t('admin.security.events.severityInfo') }
])

const statusOptions = computed(() => [
  { value: '', label: t('admin.security.events.allStatuses') },
  { value: 'new', label: t('admin.security.events.statusNew') },
  { value: 'investigating', label: t('admin.security.events.statusInvestigating') },
  { value: 'resolved', label: t('admin.security.events.statusResolved') },
  { value: 'false_positive', label: t('admin.security.events.statusFalsePositive') }
])

const categoryOptions = computed(() => [
  { value: '', label: t('admin.security.events.allCategories') },
  { value: 'sensitive_data', label: t('admin.security.events.categorySensitiveData') },
  { value: 'shadow_ai', label: t('admin.security.events.categoryShadowAI') },
  { value: 'dangerous_instruction', label: t('admin.security.events.categoryDangerousInstruction') },
  { value: 'cost_anomaly', label: t('admin.security.events.categoryCostAnomaly') }
])

const resolveStatusOptions = computed(() => [
  { value: 'resolved', label: t('admin.security.events.statusResolved') },
  { value: 'false_positive', label: t('admin.security.events.statusFalsePositive') }
])

function severityBadgeClass(severity: string): string {
  switch (severity) {
    case 'critical': return 'badge-error'
    case 'high': return 'badge-warning'
    case 'medium': return 'badge-caution'
    case 'low': return 'badge-info'
    case 'info': return 'badge-gray'
    default: return 'badge-gray'
  }
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'new': return 'badge-error'
    case 'investigating': return 'badge-warning'
    case 'resolved': return 'badge-success'
    case 'false_positive': return 'badge-gray'
    default: return 'badge-gray'
  }
}

function actionBadgeClass(action: string): string {
  switch (action) {
    case 'block': return 'badge-error'
    case 'warn': return 'badge-warning'
    case 'allow': return 'badge-success'
    case 'log': return 'badge-info'
    default: return 'badge-gray'
  }
}

function confidenceBarClass(confidence: number): string {
  if (confidence >= 0.8) return 'bg-red-500'
  if (confidence >= 0.6) return 'bg-yellow-500'
  if (confidence >= 0.4) return 'bg-blue-500'
  return 'bg-gray-400'
}

async function loadEvents() {
  loading.value = true
  try {
    const filterParams: any = {}
    if (filters.severity) filterParams.severity = filters.severity
    if (filters.status) filterParams.status = filters.status
    if (filters.category) filterParams.category = filters.category

    const response = await securityAPI.listSecurityEvents(pagination.value.page, pagination.value.page_size, filterParams)
    events.value = response.items
    pagination.value.total = response.total
  } catch (error) {
    console.error('Failed to load security events:', error)
  } finally {
    loading.value = false
  }
}

function handleFilterChange() {
  pagination.value.page = 1
  loadEvents()
}

function handlePageChange(page: number) {
  pagination.value.page = page
  loadEvents()
}

function openDetailDialog(event: SecurityEvent) {
  selectedEvent.value = event
  showDetailDialog.value = true
}

function openResolveDialog(event: SecurityEvent) {
  selectedEvent.value = event
  resolveForm.status = 'resolved'
  resolveForm.resolution = ''
  showResolveDialog.value = true
}

async function handleResolve() {
  if (!selectedEvent.value) return

  resolving.value = true
  try {
    await securityAPI.updateSecurityEventStatus(
      selectedEvent.value.id,
      resolveForm.status,
      resolveForm.resolution || undefined
    )
    showResolveDialog.value = false
    loadEvents()
  } catch (error) {
    console.error('Failed to resolve event:', error)
  } finally {
    resolving.value = false
  }
}

onMounted(() => {
  loadEvents()
})
</script>
