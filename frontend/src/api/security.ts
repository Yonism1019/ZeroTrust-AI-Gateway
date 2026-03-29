/**
 * Security module API endpoints
 * Handles security events, audit logs, and DLP rules
 */

import { apiClient } from './client'
import type { PaginatedResponse } from '@/types'

// ==================== Types ====================

export interface SecurityEvent {
  id: number
  event_type: 'L1' | 'L2' | 'L3'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  category: string
  title: string
  description?: string
  user_id?: number
  api_key_id?: number
  request_id?: string
  model?: string
  action: 'allow' | 'block' | 'warn' | 'log'
  matched_patterns?: string
  confidence: number
  request_snapshot?: string
  source_ip?: string
  user_agent?: string
  status: 'new' | 'investigating' | 'resolved' | 'false_positive'
  resolution?: string
  created_at: string
  resolved_at?: string
}

export interface AuditLog {
  id: number
  user_id?: number
  api_key_id?: number
  action: string
  resource_type: string
  resource_id?: string
  actor_ip?: string
  actor_user_agent?: string
  request_id?: string
  session_id?: string
  changes?: Record<string, any>
  result: 'success' | 'failure' | 'partial'
  failure_reason?: string
  previous_hash?: string
  record_hash: string
  created_at: string
}

export interface DLPRule {
  id: number
  name: string
  description?: string
  category: string
  pattern: string
  pattern_type: 'regex' | 'keyword' | 'pattern_match'
  severity: 'critical' | 'high' | 'medium' | 'low'
  action: 'block' | 'warn' | 'log'
  mask_content: boolean
  enabled: boolean
  priority: number
  scope: 'all' | 'group' | 'user' | 'api_key'
  models?: string[]
  metadata?: Record<string, any>
  created_by?: number
  created_at: string
  updated_at: string
}

export interface SecurityEventFilters {
  event_type?: string
  severity?: string
  category?: string
  status?: string
  user_id?: number
  api_key_id?: number
  start_time?: string
  end_time?: string
}

export interface AuditLogFilters {
  user_id?: number
  api_key_id?: number
  action?: string
  resource_type?: string
  resource_id?: string
  result?: string
  start_time?: string
  end_time?: string
}

export interface DLPRuleFilters {
  category?: string
  severity?: string
  enabled?: boolean
  scope?: string
}

// ==================== Security Events API ====================

/**
 * List security events with pagination and filters
 */
export async function listSecurityEvents(
  page: number = 1,
  pageSize: number = 20,
  filters?: SecurityEventFilters
): Promise<PaginatedResponse<SecurityEvent>> {
  const { data } = await apiClient.get<PaginatedResponse<SecurityEvent>>('/admin/security/events', {
    params: { page, page_size: pageSize, ...filters }
  })
  return data
}

/**
 * Get a single security event by ID
 */
export async function getSecurityEvent(id: number): Promise<SecurityEvent> {
  const { data } = await apiClient.get<SecurityEvent>(`/admin/security/events/${id}`)
  return data
}

/**
 * Update security event status
 */
export async function updateSecurityEventStatus(
  id: number,
  status: string,
  resolution?: string
): Promise<SecurityEvent> {
  const { data } = await apiClient.patch<SecurityEvent>(`/admin/security/events/${id}`, {
    status,
    resolution
  })
  return data
}

// ==================== Audit Logs API ====================

/**
 * List audit logs with pagination and filters
 */
export async function listAuditLogs(
  page: number = 1,
  pageSize: number = 20,
  filters?: AuditLogFilters
): Promise<PaginatedResponse<AuditLog>> {
  const { data } = await apiClient.get<PaginatedResponse<AuditLog>>('/admin/security/audit-logs', {
    params: { page, page_size: pageSize, ...filters }
  })
  return data
}

/**
 * Get a single audit log by ID
 */
export async function getAuditLog(id: number): Promise<AuditLog> {
  const { data } = await apiClient.get<AuditLog>(`/admin/security/audit-logs/${id}`)
  return data
}

/**
 * Verify audit chain integrity
 */
export async function verifyAuditChain(fromId: number, toId: number): Promise<{ valid: boolean }> {
  const { data } = await apiClient.post<{ valid: boolean }>('/admin/security/audit-logs/verify', {
    from_id: fromId,
    to_id: toId
  })
  return data
}

// ==================== DLP Rules API ====================

/**
 * List DLP rules with pagination and filters
 */
export async function listDLPRules(
  page: number = 1,
  pageSize: number = 20,
  filters?: DLPRuleFilters
): Promise<PaginatedResponse<DLPRule>> {
  const { data } = await apiClient.get<PaginatedResponse<DLPRule>>('/admin/security/dlp-rules', {
    params: { page, page_size: pageSize, ...filters }
  })
  return data
}

/**
 * Get a single DLP rule by ID
 */
export async function getDLPRule(id: number): Promise<DLPRule> {
  const { data } = await apiClient.get<DLPRule>(`/admin/security/dlp-rules/${id}`)
  return data
}

const securityAPI = {
  listSecurityEvents,
  getSecurityEvent,
  updateSecurityEventStatus,
  listAuditLogs,
  getAuditLog,
  verifyAuditChain,
  listDLPRules,
  getDLPRule
}

export default securityAPI
