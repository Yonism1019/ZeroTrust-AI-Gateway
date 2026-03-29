<template>
  <AppLayout>
    <TablePageLayout>
      <template #filters>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Left: Filters -->
          <div class="flex flex-1 flex-wrap items-center gap-2">
            <Select
              v-model="filters.action"
              :options="actionOptions"
              class="w-32"
              :placeholder="t('admin.security.auditLogs.action')"
              @change="handleFilterChange"
            />
            <Select
              v-model="filters.result"
              :options="resultOptions"
              class="w-32"
              :placeholder="t('admin.security.auditLogs.result')"
              @change="handleFilterChange"
            />
            <input
              v-model="filters.resourceType"
              type="text"
              :placeholder="t('admin.security.auditLogs.resourceType')"
              class="input w-40"
              @input="handleFilterChange"
            />
          </div>

          <!-- Right: Action buttons -->
          <div class="flex flex-wrap items-center justify-end gap-2">
            <button
              @click="openVerifyDialog"
              class="btn btn-secondary"
              :title="t('admin.security.auditLogs.verifyChain')"
            >
              <Icon name="shield" size="md" />
            </button>
            <button
              @click="loadLogs"
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
        <DataTable :columns="columns" :data="logs" :loading="loading">
          <template #cell-action="{ value }">
            <span class="badge badge-info">{{ value }}</span>
          </template>

          <template #cell-resourceType="{ value }">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ value }}</span>
          </template>

          <template #cell-result="{ value }">
            <span
              :class="[
                'badge',
                resultBadgeClass(value)
              ]"
            >
              {{ value }}
            </span>
          </template>

          <template #cell-actor="{ row }">
            <div class="text-sm">
              <div class="text-gray-900 dark:text-white">
                {{ row.user_id ? `User #${row.user_id}` : row.api_key_id ? `API Key #${row.api_key_id}` : '-' }}
              </div>
              <div v-if="row.actor_ip" class="text-xs text-gray-500 dark:text-dark-400">
                {{ row.actor_ip }}
              </div>
            </div>
          </template>

          <template #cell-changes="{ row }">
            <span v-if="row.changes && Object.keys(row.changes).length > 0" class="text-sm text-blue-600 dark:text-blue-400">
              {{ Object.keys(row.changes).length }} field(s)
            </span>
            <span v-else class="text-sm text-gray-400">-</span>
          </template>

          <template #cell-createdAt="{ value }">
            <span class="text-sm text-gray-500 dark:text-dark-400">{{ formatDateTime(value) }}</span>
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
            </div>
          </template>

          <template #empty>
            <EmptyState
              :title="t('empty.noData')"
              :description="t('admin.security.auditLogs.failedToLoad')"
              @action="loadLogs"
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
    <BaseDialog :show="showDetailDialog" :title="t('admin.security.auditLogs.logDetail')" width="wide" @close="showDetailDialog = false">
      <div v-if="selectedLog" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.id') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">#{{ selectedLog.id }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.action') }}</label>
            <p class="mt-1">
              <span class="badge badge-info">{{ selectedLog.action }}</span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.resourceType') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedLog.resource_type }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.result') }}</label>
            <p class="mt-1">
              <span :class="['badge', resultBadgeClass(selectedLog.result)]">
                {{ selectedLog.result }}
              </span>
            </p>
          </div>
        </div>

        <div v-if="selectedLog.resource_id">
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.resourceId') }}</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedLog.resource_id }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.userId') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedLog.user_id || '-' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.apiKeyId') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedLog.api_key_id || '-' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.actorIp') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedLog.actor_ip || '-' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.sessionId') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white truncate">{{ selectedLog.session_id || '-' }}</p>
          </div>
        </div>

        <div v-if="selectedLog.request_id">
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.requestId') }}</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white font-mono text-xs">{{ selectedLog.request_id }}</p>
        </div>

        <div v-if="selectedLog.changes && Object.keys(selectedLog.changes).length > 0">
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.changes') }}</label>
          <pre class="mt-1 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-dark-700">{{ JSON.stringify(selectedLog.changes, null, 2) }}</pre>
        </div>

        <div v-if="selectedLog.failure_reason">
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.failureReason') }}</label>
          <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ selectedLog.failure_reason }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.recordHash') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white font-mono text-xs break-all">{{ selectedLog.record_hash }}</p>
          </div>
          <div v-if="selectedLog.previous_hash">
            <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.previousHash') }}</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white font-mono text-xs break-all">{{ selectedLog.previous_hash }}</p>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-dark-400">{{ t('admin.security.auditLogs.createdAt') }}</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDateTime(selectedLog.created_at) }}</p>
        </div>
      </div>
    </BaseDialog>

    <!-- Verify Chain Dialog -->
    <BaseDialog :show="showVerifyDialog" :title="t('admin.security.auditLogs.verifyChain')" width="narrow" @close="showVerifyDialog = false">
      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ t('admin.security.auditLogs.verifyChainDescription') }}
        </p>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-200">
            {{ t('admin.security.auditLogs.fromId') }}
          </label>
          <input
            v-model.number="verifyForm.fromId"
            type="number"
            min="1"
            class="mt-1 input w-full"
            :placeholder="t('admin.security.auditLogs.fromIdPlaceholder')"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-200">
            {{ t('admin.security.auditLogs.toId') }}
          </label>
          <input
            v-model.number="verifyForm.toId"
            type="number"
            min="1"
            class="mt-1 input w-full"
            :placeholder="t('admin.security.auditLogs.toIdPlaceholder')"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showVerifyDialog = false" class="btn btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button @click="handleVerify" :disabled="verifying" class="btn btn-primary">
            {{ verifying ? t('common.submitting') : t('common.verify') }}
          </button>
        </div>
      </template>
    </BaseDialog>

    <!-- Verify Result Dialog -->
    <BaseDialog :show="showVerifyResultDialog" :title="t('admin.security.auditLogs.verifyResult')" width="narrow" @close="showVerifyResultDialog = false">
      <div class="text-center py-4">
        <div
          :class="[
            'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4',
            verifyResult?.valid ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
          ]"
        >
          <Icon
            :name="verifyResult?.valid ? 'check' : 'x'"
            size="xl"
            :class="verifyResult?.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
          />
        </div>
        <p class="text-lg font-medium" :class="verifyResult?.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
          {{ verifyResult?.valid ? t('admin.security.auditLogs.chainValid') : t('admin.security.auditLogs.chainInvalid') }}
        </p>
      </div>
    </BaseDialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import securityAPI, { type AuditLog } from '@/api/security'
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
const verifying = ref(false)
const logs = ref<AuditLog[]>([])
const pagination = ref({
  page: 1,
  page_size: 20,
  total: 0
})

const filters = reactive({
  action: '',
  result: '',
  resourceType: ''
})

const showDetailDialog = ref(false)
const showVerifyDialog = ref(false)
const showVerifyResultDialog = ref(false)
const selectedLog = ref<AuditLog | null>(null)
const verifyResult = ref<{ valid: boolean } | null>(null)

const verifyForm = reactive({
  fromId: 1,
  toId: 1
})

const columns = computed(() => [
  { key: 'id', label: t('admin.security.auditLogs.id'), width: '8%' },
  { key: 'action', label: t('admin.security.auditLogs.action'), width: '12%' },
  { key: 'resourceType', label: t('admin.security.auditLogs.resourceType'), width: '15%' },
  { key: 'actor', label: t('admin.security.auditLogs.actor'), width: '18%' },
  { key: 'result', label: t('admin.security.auditLogs.result'), width: '10%' },
  { key: 'changes', label: t('admin.security.auditLogs.changes'), width: '10%' },
  { key: 'createdAt', label: t('admin.security.auditLogs.createdAt'), width: '15%' },
  { key: 'actions', label: t('common.actions'), width: '5%', sortable: false }
])

const actionOptions = computed(() => [
  { value: '', label: t('admin.security.auditLogs.allActions') },
  { value: 'create', label: t('admin.security.auditLogs.actionCreate') },
  { value: 'read', label: t('admin.security.auditLogs.actionRead') },
  { value: 'update', label: t('admin.security.auditLogs.actionUpdate') },
  { value: 'delete', label: t('admin.security.auditLogs.actionDelete') },
  { value: 'execute', label: t('admin.security.auditLogs.actionExecute') },
  { value: 'login', label: t('admin.security.auditLogs.actionLogin') },
  { value: 'logout', label: t('admin.security.auditLogs.actionLogout') }
])

const resultOptions = computed(() => [
  { value: '', label: t('admin.security.auditLogs.allResults') },
  { value: 'success', label: t('admin.security.auditLogs.resultSuccess') },
  { value: 'failure', label: t('admin.security.auditLogs.resultFailure') },
  { value: 'partial', label: t('admin.security.auditLogs.resultPartial') }
])

function resultBadgeClass(result: string): string {
  switch (result) {
    case 'success': return 'badge-success'
    case 'failure': return 'badge-error'
    case 'partial': return 'badge-warning'
    default: return 'badge-gray'
  }
}

async function loadLogs() {
  loading.value = true
  try {
    const filterParams: any = {}
    if (filters.action) filterParams.action = filters.action
    if (filters.result) filterParams.result = filters.result
    if (filters.resourceType) filterParams.resource_type = filters.resourceType

    const response = await securityAPI.listAuditLogs(pagination.value.page, pagination.value.page_size, filterParams)
    logs.value = response.items
    pagination.value.total = response.total
  } catch (error) {
    console.error('Failed to load audit logs:', error)
  } finally {
    loading.value = false
  }
}

function handleFilterChange() {
  pagination.value.page = 1
  loadLogs()
}

function handlePageChange(page: number) {
  pagination.value.page = page
  loadLogs()
}

function openDetailDialog(log: AuditLog) {
  selectedLog.value = log
  showDetailDialog.value = true
}

function openVerifyDialog() {
  verifyForm.fromId = 1
  verifyForm.toId = Math.max(1, pagination.value.total > 0 ? Math.min(10, pagination.value.total) : 1)
  showVerifyDialog.value = true
}

async function handleVerify() {
  verifying.value = true
  try {
    verifyResult.value = await securityAPI.verifyAuditChain(verifyForm.fromId, verifyForm.toId)
    showVerifyDialog.value = false
    showVerifyResultDialog.value = true
  } catch (error) {
    console.error('Failed to verify audit chain:', error)
  } finally {
    verifying.value = false
  }
}

onMounted(() => {
  loadLogs()
})
</script>
