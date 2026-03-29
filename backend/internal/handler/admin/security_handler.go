package admin

import (
	"strconv"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/pkg/pagination"
	"github.com/Wei-Shaw/sub2api/internal/pkg/response"
	"github.com/Wei-Shaw/sub2api/internal/service"
	"github.com/gin-gonic/gin"
)

// SecurityHandler handles admin security management
type SecurityHandler struct {
	securityService service.SecurityService
}

// NewSecurityHandler creates a new admin security handler
func NewSecurityHandler(securityService service.SecurityService) *SecurityHandler {
	return &SecurityHandler{
		securityService: securityService,
	}
}

// ListSecurityEvents handles listing security events with filters
// GET /api/v1/admin/security/events
func (h *SecurityHandler) ListSecurityEvents(c *gin.Context) {
	page, pageSize := response.ParsePagination(c)

	filters := service.SecurityEventFilters{}
	if eventType := c.Query("event_type"); eventType != "" {
		filters.EventType = &eventType
	}
	if severity := c.Query("severity"); severity != "" {
		filters.Severity = &severity
	}
	if category := c.Query("category"); category != "" {
		filters.Category = &category
	}
	if status := c.Query("status"); status != "" {
		filters.Status = &status
	}
	if userIDStr := c.Query("user_id"); userIDStr != "" {
		if userID, err := strconv.ParseInt(userIDStr, 10, 64); err == nil {
			filters.UserID = &userID
		}
	}
	if apiKeyIDStr := c.Query("api_key_id"); apiKeyIDStr != "" {
		if apiKeyID, err := strconv.ParseInt(apiKeyIDStr, 10, 64); err == nil {
			filters.APIKeyID = &apiKeyID
		}
	}
	if startTime := c.Query("start_time"); startTime != "" {
		if t, err := time.Parse(time.RFC3339, startTime); err == nil {
			filters.StartTime = &t
		}
	}
	if endTime := c.Query("end_time"); endTime != "" {
		if t, err := time.Parse(time.RFC3339, endTime); err == nil {
			filters.EndTime = &t
		}
	}

	params := pagination.PaginationParams{
		Page:     page,
		PageSize: pageSize,
	}
	items, total, err := h.securityService.ListSecurityEvents(c.Request.Context(), params, filters)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	out := make([]SecurityEventDTO, 0, len(items))
	for i := range items {
		out = append(out, *securityEventToDTO(&items[i]))
	}
	response.Paginated(c, out, total, page, pageSize)
}

// GetSecurityEvent handles getting a single security event by ID
// GET /api/v1/admin/security/events/:id
func (h *SecurityHandler) GetSecurityEvent(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, 400, "invalid event id")
		return
	}

	event, err := h.securityService.GetSecurityEvent(c.Request.Context(), id)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	response.Success(c, securityEventToDTO(event))
}

// UpdateSecurityEventStatus handles updating security event status
// PATCH /api/v1/admin/security/events/:id
func (h *SecurityHandler) UpdateSecurityEventStatus(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, 400, "invalid event id")
		return
	}

	var req UpdateSecurityEventStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}

	event, err := h.securityService.UpdateSecurityEventStatus(c.Request.Context(), id, req.Status, req.Resolution)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	response.Success(c, securityEventToDTO(event))
}

// ListAuditLogs handles listing audit logs with filters
// GET /api/v1/admin/security/audit-logs
func (h *SecurityHandler) ListAuditLogs(c *gin.Context) {
	page, pageSize := response.ParsePagination(c)

	filters := service.AuditLogFilters{}
	if userIDStr := c.Query("user_id"); userIDStr != "" {
		if userID, err := strconv.ParseInt(userIDStr, 10, 64); err == nil {
			filters.UserID = &userID
		}
	}
	if apiKeyIDStr := c.Query("api_key_id"); apiKeyIDStr != "" {
		if apiKeyID, err := strconv.ParseInt(apiKeyIDStr, 10, 64); err == nil {
			filters.APIKeyID = &apiKeyID
		}
	}
	if action := c.Query("action"); action != "" {
		filters.Action = &action
	}
	if resourceType := c.Query("resource_type"); resourceType != "" {
		filters.ResourceType = &resourceType
	}
	if resourceID := c.Query("resource_id"); resourceID != "" {
		filters.ResourceID = &resourceID
	}
	if result := c.Query("result"); result != "" {
		filters.Result = &result
	}
	if startTime := c.Query("start_time"); startTime != "" {
		if t, err := time.Parse(time.RFC3339, startTime); err == nil {
			filters.StartTime = &t
		}
	}
	if endTime := c.Query("end_time"); endTime != "" {
		if t, err := time.Parse(time.RFC3339, endTime); err == nil {
			filters.EndTime = &t
		}
	}

	params := pagination.PaginationParams{
		Page:     page,
		PageSize: pageSize,
	}
	items, total, err := h.securityService.ListAuditLogs(c.Request.Context(), params, filters)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	out := make([]AuditLogDTO, 0, len(items))
	for i := range items {
		out = append(out, *auditLogToDTO(&items[i]))
	}
	response.Paginated(c, out, total, page, pageSize)
}

// GetAuditLog handles getting a single audit log by ID
// GET /api/v1/admin/security/audit-logs/:id
func (h *SecurityHandler) GetAuditLog(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, 400, "invalid audit log id")
		return
	}

	log, err := h.securityService.GetAuditLog(c.Request.Context(), id)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	response.Success(c, auditLogToDTO(log))
}

// VerifyAuditChain handles verifying audit chain integrity
// POST /api/v1/admin/security/audit-logs/verify
func (h *SecurityHandler) VerifyAuditChain(c *gin.Context) {
	var req VerifyAuditChainRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}

	valid, err := h.securityService.VerifyAuditChain(c.Request.Context(), req.FromID, req.ToID)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	response.Success(c, gin.H{"valid": valid})
}

// ListDLPRules handles listing DLP rules with filters
// GET /api/v1/admin/security/dlp-rules
func (h *SecurityHandler) ListDLPRules(c *gin.Context) {
	page, pageSize := response.ParsePagination(c)

	filters := service.DLPRuleFilters{}
	if category := c.Query("category"); category != "" {
		filters.Category = &category
	}
	if severity := c.Query("severity"); severity != "" {
		filters.Severity = &severity
	}
	if scope := c.Query("scope"); scope != "" {
		filters.Scope = &scope
	}
	if enabledStr := c.Query("enabled"); enabledStr != "" {
		enabled := enabledStr == "true"
		filters.Enabled = &enabled
	}

	params := pagination.PaginationParams{
		Page:     page,
		PageSize: pageSize,
	}
	items, total, err := h.securityService.ListDLPRules(c.Request.Context(), params, filters)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	out := make([]DLPRuleDTO, 0, len(items))
	for i := range items {
		out = append(out, *dlpRuleToDTO(&items[i]))
	}
	response.Paginated(c, out, total, page, pageSize)
}

// GetDLPRule handles getting a single DLP rule by ID
// GET /api/v1/admin/security/dlp-rules/:id
func (h *SecurityHandler) GetDLPRule(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, 400, "invalid DLP rule id")
		return
	}

	rule, err := h.securityService.GetDLPRule(c.Request.Context(), id)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	response.Success(c, dlpRuleToDTO(rule))
}

// Request/Response DTOs

type UpdateSecurityEventStatusRequest struct {
	Status     string `json:"status" binding:"required,oneof=new investigating resolved false_positive"`
	Resolution string `json:"resolution"`
}

type VerifyAuditChainRequest struct {
	FromID int64 `json:"from_id" binding:"required"`
	ToID   int64 `json:"to_id" binding:"required"`
}

// DTOs

type SecurityEventDTO struct {
	ID              int64   `json:"id"`
	EventType       string  `json:"event_type"`
	Severity        string  `json:"severity"`
	Category        string  `json:"category"`
	Title           string  `json:"title"`
	Description     *string `json:"description,omitempty"`
	UserID          *int64  `json:"user_id,omitempty"`
	APIKeyID        *int64  `json:"api_key_id,omitempty"`
	RequestID       *string `json:"request_id,omitempty"`
	Model           *string `json:"model,omitempty"`
	Action          string  `json:"action"`
	MatchedPatterns *string `json:"matched_patterns,omitempty"`
	Confidence      float64 `json:"confidence"`
	RequestSnapshot *string `json:"request_snapshot,omitempty"`
	SourceIP        *string `json:"source_ip,omitempty"`
	UserAgent       *string `json:"user_agent,omitempty"`
	Status          string  `json:"status"`
	Resolution      *string `json:"resolution,omitempty"`
	CreatedAt       string  `json:"created_at"`
	ResolvedAt      *string `json:"resolved_at,omitempty"`
}

func securityEventToDTO(e *service.SecurityEvent) *SecurityEventDTO {
	dto := &SecurityEventDTO{
		ID:              e.ID,
		EventType:       e.EventType,
		Severity:        e.Severity,
		Category:        e.Category,
		Title:           e.Title,
		Description:     e.Description,
		UserID:          e.UserID,
		APIKeyID:        e.APIKeyID,
		RequestID:       e.RequestID,
		Model:           e.Model,
		Action:          e.Action,
		MatchedPatterns: e.MatchedPatterns,
		Confidence:      e.Confidence,
		RequestSnapshot: e.RequestSnapshot,
		SourceIP:        e.SourceIP,
		UserAgent:       e.UserAgent,
		Status:          e.Status,
		Resolution:      e.Resolution,
	}
	if !e.CreatedAt.IsZero() {
		dto.CreatedAt = e.CreatedAt.Format(time.RFC3339)
	}
	if e.ResolvedAt != nil && !e.ResolvedAt.IsZero() {
		t := e.ResolvedAt.Format(time.RFC3339)
		dto.ResolvedAt = &t
	}
	return dto
}

type AuditLogDTO struct {
	ID             int64          `json:"id"`
	UserID         *int64         `json:"user_id,omitempty"`
	APIKeyID       *int64         `json:"api_key_id,omitempty"`
	Action         string         `json:"action"`
	ResourceType   string         `json:"resource_type"`
	ResourceID     *string        `json:"resource_id,omitempty"`
	ActorIP        *string        `json:"actor_ip,omitempty"`
	ActorUserAgent *string        `json:"actor_user_agent,omitempty"`
	RequestID      *string        `json:"request_id,omitempty"`
	SessionID      *string        `json:"session_id,omitempty"`
	Changes        map[string]any `json:"changes,omitempty"`
	Result         string         `json:"result"`
	FailureReason  *string        `json:"failure_reason,omitempty"`
	PreviousHash   *string        `json:"previous_hash,omitempty"`
	RecordHash     string         `json:"record_hash"`
	CreatedAt      string         `json:"created_at"`
}

func auditLogToDTO(a *service.AuditLog) *AuditLogDTO {
	dto := &AuditLogDTO{
		ID:             a.ID,
		UserID:         a.UserID,
		APIKeyID:       a.APIKeyID,
		Action:         a.Action,
		ResourceType:   a.ResourceType,
		ResourceID:     a.ResourceID,
		ActorIP:        a.ActorIP,
		ActorUserAgent: a.ActorUserAgent,
		RequestID:      a.RequestID,
		SessionID:      a.SessionID,
		Changes:        a.Changes,
		Result:         a.Result,
		FailureReason:  a.FailureReason,
		PreviousHash:   a.PreviousHash,
		RecordHash:     a.RecordHash,
	}
	if !a.CreatedAt.IsZero() {
		dto.CreatedAt = a.CreatedAt.Format(time.RFC3339)
	}
	return dto
}

type DLPRuleDTO struct {
	ID          int64          `json:"id"`
	Name        string         `json:"name"`
	Description *string        `json:"description,omitempty"`
	Category    string         `json:"category"`
	Pattern     string         `json:"pattern"`
	PatternType string         `json:"pattern_type"`
	Severity    string         `json:"severity"`
	Action      string         `json:"action"`
	MaskContent bool           `json:"mask_content"`
	Enabled     bool           `json:"enabled"`
	Priority    int            `json:"priority"`
	Scope       string         `json:"scope"`
	Models      []string       `json:"models,omitempty"`
	Metadata    map[string]any `json:"metadata,omitempty"`
	CreatedBy   *int64         `json:"created_by,omitempty"`
	CreatedAt   string         `json:"created_at"`
	UpdatedAt   string         `json:"updated_at"`
}

func dlpRuleToDTO(r *service.DLPRule) *DLPRuleDTO {
	dto := &DLPRuleDTO{
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Description,
		Category:    r.Category,
		Pattern:     r.Pattern,
		PatternType: r.PatternType,
		Severity:    r.Severity,
		Action:      r.Action,
		MaskContent: r.MaskContent,
		Enabled:     r.Enabled,
		Priority:    r.Priority,
		Scope:       r.Scope,
		Models:      r.Models,
		Metadata:    r.Metadata,
		CreatedBy:   r.CreatedBy,
	}
	if !r.CreatedAt.IsZero() {
		dto.CreatedAt = r.CreatedAt.Format(time.RFC3339)
	}
	if !r.UpdatedAt.IsZero() {
		dto.UpdatedAt = r.UpdatedAt.Format(time.RFC3339)
	}
	return dto
}
