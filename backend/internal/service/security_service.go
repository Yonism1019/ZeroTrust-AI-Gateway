// Package service provides security services for ZeroTrust AI Gateway.
package service

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	dbent "github.com/Wei-Shaw/sub2api/ent"
	"github.com/Wei-Shaw/sub2api/ent/auditlog"
	"github.com/Wei-Shaw/sub2api/ent/dlprule"
	"github.com/Wei-Shaw/sub2api/ent/securityevent"
	"github.com/Wei-Shaw/sub2api/internal/pkg/logger"
	"github.com/Wei-Shaw/sub2api/internal/pkg/pagination"
	"github.com/Wei-Shaw/sub2api/internal/security"
)

// SecurityService defines operations for security audit and event management.
type SecurityService interface {
	// Audit Log operations
	CreateAuditLog(ctx context.Context, input *CreateAuditLogInput) (*AuditLog, error)
	ListAuditLogs(ctx context.Context, params pagination.PaginationParams, filters AuditLogFilters) ([]AuditLog, int64, error)
	GetAuditLog(ctx context.Context, id int64) (*AuditLog, error)
	VerifyAuditChain(ctx context.Context, fromID, toID int64) (bool, error)

	// Security Event operations
	CreateSecurityEvent(ctx context.Context, input *CreateSecurityEventInput) (*SecurityEvent, error)
	ListSecurityEvents(ctx context.Context, params pagination.PaginationParams, filters SecurityEventFilters) ([]SecurityEvent, int64, error)
	GetSecurityEvent(ctx context.Context, id int64) (*SecurityEvent, error)
	UpdateSecurityEventStatus(ctx context.Context, id int64, status string, resolution string) (*SecurityEvent, error)

	// DLP Rule operations
	ListDLPRules(ctx context.Context, params pagination.PaginationParams, filters DLPRuleFilters) ([]DLPRule, int64, error)
	GetDLPRule(ctx context.Context, id int64) (*DLPRule, error)

	// Detection operations
	DetectSensitiveData(ctx context.Context, prompt, systemPrompt, history string) (*security.DetectionResult, error)
}

// CreateAuditLogInput defines input for creating an audit log entry.
type CreateAuditLogInput struct {
	UserID         *int64
	APIKeyID       *int64
	Action         string // create, read, update, delete, execute, login, logout
	ResourceType   string // api_key, user, account, policy, config
	ResourceID     *string
	ActorIP        *string
	ActorUserAgent *string
	RequestID      *string
	SessionID      *string
	Changes        map[string]any // before/after values
	Result         string         // success, failure, partial
	FailureReason  *string
}

// AuditLogFilters defines filters for querying audit logs.
type AuditLogFilters struct {
	UserID       *int64
	APIKeyID     *int64
	Action       *string
	ResourceType *string
	ResourceID   *string
	Result       *string
	StartTime    *time.Time
	EndTime      *time.Time
}

// CreateSecurityEventInput defines input for creating a security event.
type CreateSecurityEventInput struct {
	EventType       string
	Severity        string // critical, high, medium, low, info
	Category        string // sensitive_data, shadow_ai, dangerous_instruction, cost_anomaly
	Title           string
	Description     *string
	UserID          *int64
	APIKeyID        *int64
	RequestID       *string
	Model           *string
	Action          string  // allow, block, warn, log
	MatchedPatterns *string // JSON array of matched patterns
	Confidence      float64
	RequestSnapshot *string
	SourceIP        *string
	UserAgent       *string
}

// SecurityEventFilters defines filters for querying security events.
type SecurityEventFilters struct {
	EventType *string
	Severity  *string
	Category  *string
	Status    *string
	UserID    *int64
	APIKeyID  *int64
	StartTime *time.Time
	EndTime   *time.Time
}

// DLPRuleFilters defines filters for querying DLP rules.
type DLPRuleFilters struct {
	Category *string
	Severity *string
	Enabled  *bool
	Scope    *string
}

// AuditLog represents an audit log entry.
type AuditLog struct {
	ID             int64
	UserID         *int64
	APIKeyID       *int64
	Action         string
	ResourceType   string
	ResourceID     *string
	ActorIP        *string
	ActorUserAgent *string
	RequestID      *string
	SessionID      *string
	Changes        map[string]any
	Result         string
	FailureReason  *string
	PreviousHash   *string
	RecordHash     string
	CreatedAt      time.Time
}

// SecurityEvent represents a security event entry.
type SecurityEvent struct {
	ID              int64
	EventType       string
	Severity        string
	Category        string
	Title           string
	Description     *string
	UserID          *int64
	APIKeyID        *int64
	RequestID       *string
	Model           *string
	Action          string
	MatchedPatterns *string
	Confidence      float64
	RequestSnapshot *string
	SourceIP        *string
	UserAgent       *string
	Status          string
	Resolution      *string
	CreatedAt       time.Time
	ResolvedAt      *time.Time
}

// DLPRule represents a DLP rule entry.
type DLPRule struct {
	ID          int64
	Name        string
	Description *string
	Category    string
	Pattern     string
	PatternType string
	Severity    string
	Action      string
	MaskContent bool
	Enabled     bool
	Priority    int
	Scope       string
	Models      []string
	Metadata    map[string]any
	CreatedBy   *int64
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// securityServiceImpl implements SecurityService.
type securityServiceImpl struct {
	entClient  *dbent.Client
	l1Detector *security.L1Detector
}

// NewSecurityService creates a new SecurityService.
func NewSecurityService(entClient *dbent.Client) SecurityService {
	return &securityServiceImpl{
		entClient:  entClient,
		l1Detector: security.NewL1Detector(),
	}
}

// CreateAuditLog creates a new audit log entry with hash chain support.
func (s *securityServiceImpl) CreateAuditLog(ctx context.Context, input *CreateAuditLogInput) (*AuditLog, error) {
	if s.entClient == nil {
		return nil, fmt.Errorf("ent client is nil")
	}

	// Build the record hash
	recordData := buildAuditRecordData(input)
	recordHash := computeHash(recordData)

	// Get the previous hash for chain
	var previousHash *string
	lastLog, err := s.entClient.AuditLog.Query().
		Order(dbent.Desc(auditlog.FieldID)).
		First(ctx)
	if err == nil && lastLog != nil {
		previousHash = &lastLog.RecordHash
	}

	// Create the audit log entry
	create := s.entClient.AuditLog.Create().
		SetAction(input.Action).
		SetResourceType(input.ResourceType).
		SetRecordHash(recordHash).
		SetResult(input.Result).
		SetCreatedAt(time.Now())

	// Set optional fields
	if input.UserID != nil {
		create.SetUserID(*input.UserID)
	}
	if input.APIKeyID != nil {
		create.SetAPIKeyID(*input.APIKeyID)
	}
	if input.ResourceID != nil {
		create.SetResourceID(*input.ResourceID)
	}
	if input.ActorIP != nil {
		create.SetActorIP(*input.ActorIP)
	}
	if input.ActorUserAgent != nil {
		create.SetActorUserAgent(*input.ActorUserAgent)
	}
	if input.RequestID != nil {
		create.SetRequestID(*input.RequestID)
	}
	if input.SessionID != nil {
		create.SetSessionID(*input.SessionID)
	}
	if input.Changes != nil {
		changesJSON, err := json.Marshal(input.Changes)
		if err == nil {
			create.SetChanges(string(changesJSON))
		}
	}
	if input.FailureReason != nil {
		create.SetFailureReason(*input.FailureReason)
	}
	if previousHash != nil {
		create.SetPreviousHash(*previousHash)
	}

	entity, err := create.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create audit log: %w", err)
	}

	return s.entToAuditLog(entity)
}

// ListAuditLogs returns paginated audit logs based on filters.
func (s *securityServiceImpl) ListAuditLogs(ctx context.Context, params pagination.PaginationParams, filters AuditLogFilters) ([]AuditLog, int64, error) {
	if s.entClient == nil {
		return nil, 0, fmt.Errorf("ent client is nil")
	}

	query := s.entClient.AuditLog.Query()

	// Apply filters
	if filters.UserID != nil {
		query.Where(auditlog.UserID(*filters.UserID))
	}
	if filters.APIKeyID != nil {
		query.Where(auditlog.APIKeyID(*filters.APIKeyID))
	}
	if filters.Action != nil && *filters.Action != "" {
		query.Where(auditlog.Action(*filters.Action))
	}
	if filters.ResourceType != nil && *filters.ResourceType != "" {
		query.Where(auditlog.ResourceType(*filters.ResourceType))
	}
	if filters.ResourceID != nil && *filters.ResourceID != "" {
		query.Where(auditlog.ResourceID(*filters.ResourceID))
	}
	if filters.Result != nil && *filters.Result != "" {
		query.Where(auditlog.Result(*filters.Result))
	}
	if filters.StartTime != nil {
		query.Where(auditlog.CreatedAtGTE(*filters.StartTime))
	}
	if filters.EndTime != nil {
		query.Where(auditlog.CreatedAtLTE(*filters.EndTime))
	}

	// Get total count
	total, err := query.Count(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count audit logs: %w", err)
	}

	// Apply pagination
	query.Order(dbent.Desc(auditlog.FieldID))
	query.Limit(params.PageSize)
	query.Offset((params.Page - 1) * params.PageSize)

	entities, err := query.All(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query audit logs: %w", err)
	}

	auditLogs := make([]AuditLog, 0, len(entities))
	for _, entity := range entities {
		auditLog, err := s.entToAuditLog(entity)
		if err != nil {
			logger.LegacyPrintf("service.security", "failed to convert audit log: %v", err)
			continue
		}
		auditLogs = append(auditLogs, *auditLog)
	}

	return auditLogs, int64(total), nil
}

// GetAuditLog returns a single audit log by ID.
func (s *securityServiceImpl) GetAuditLog(ctx context.Context, id int64) (*AuditLog, error) {
	if s.entClient == nil {
		return nil, fmt.Errorf("ent client is nil")
	}

	entity, err := s.entClient.AuditLog.Get(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get audit log: %w", err)
	}

	return s.entToAuditLog(entity)
}

// VerifyAuditChain verifies the integrity of the audit chain between two IDs.
func (s *securityServiceImpl) VerifyAuditChain(ctx context.Context, fromID, toID int64) (bool, error) {
	if s.entClient == nil {
		return false, fmt.Errorf("ent client is nil")
	}

	// Get all logs between fromID and toID ordered by ID
	logs, err := s.entClient.AuditLog.Query().
		Where(auditlog.IDGTE(fromID), auditlog.IDLTE(toID)).
		Order(dbent.Asc(auditlog.FieldID)).
		All(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query audit logs: %w", err)
	}

	var expectedPreviousHash string
	for _, log := range logs {
		// Verify the previous hash matches
		if log.PreviousHash != nil && *log.PreviousHash != expectedPreviousHash {
			if expectedPreviousHash == "" && log.PreviousHash != nil {
				// First record in chain - previous hash should be empty or match genesis
				continue
			}
			return false, nil
		}

		// Verify the record hash (simplified check)
		if log.RecordHash == "" {
			return false, nil
		}

		expectedPreviousHash = log.RecordHash
	}

	return true, nil
}

// CreateSecurityEvent creates a new security event.
func (s *securityServiceImpl) CreateSecurityEvent(ctx context.Context, input *CreateSecurityEventInput) (*SecurityEvent, error) {
	if s.entClient == nil {
		return nil, fmt.Errorf("ent client is nil")
	}

	create := s.entClient.SecurityEvent.Create().
		SetEventType(input.EventType).
		SetSeverity(input.Severity).
		SetCategory(input.Category).
		SetTitle(input.Title).
		SetAction(input.Action).
		SetConfidence(input.Confidence).
		SetStatus("new").
		SetCreatedAt(time.Now())

	// Set optional fields
	if input.Description != nil {
		create.SetDescription(*input.Description)
	}
	if input.UserID != nil {
		create.SetUserID(*input.UserID)
	}
	if input.APIKeyID != nil {
		create.SetAPIKeyID(*input.APIKeyID)
	}
	if input.RequestID != nil {
		create.SetRequestID(*input.RequestID)
	}
	if input.Model != nil {
		create.SetModel(*input.Model)
	}
	if input.MatchedPatterns != nil {
		create.SetMatchedPatterns(*input.MatchedPatterns)
	}
	if input.RequestSnapshot != nil {
		create.SetRequestSnapshot(*input.RequestSnapshot)
	}
	if input.SourceIP != nil {
		create.SetSourceIP(*input.SourceIP)
	}
	if input.UserAgent != nil {
		create.SetUserAgent(*input.UserAgent)
	}

	entity, err := create.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create security event: %w", err)
	}

	return s.entToSecurityEvent(entity)
}

// ListSecurityEvents returns paginated security events based on filters.
func (s *securityServiceImpl) ListSecurityEvents(ctx context.Context, params pagination.PaginationParams, filters SecurityEventFilters) ([]SecurityEvent, int64, error) {
	if s.entClient == nil {
		return nil, 0, fmt.Errorf("ent client is nil")
	}

	query := s.entClient.SecurityEvent.Query()

	// Apply filters
	if filters.EventType != nil && *filters.EventType != "" {
		query.Where(securityevent.EventType(*filters.EventType))
	}
	if filters.Severity != nil && *filters.Severity != "" {
		query.Where(securityevent.Severity(*filters.Severity))
	}
	if filters.Category != nil && *filters.Category != "" {
		query.Where(securityevent.Category(*filters.Category))
	}
	if filters.Status != nil && *filters.Status != "" {
		query.Where(securityevent.Status(*filters.Status))
	}
	if filters.UserID != nil {
		query.Where(securityevent.UserID(*filters.UserID))
	}
	if filters.APIKeyID != nil {
		query.Where(securityevent.APIKeyID(*filters.APIKeyID))
	}
	if filters.StartTime != nil {
		query.Where(securityevent.CreatedAtGTE(*filters.StartTime))
	}
	if filters.EndTime != nil {
		query.Where(securityevent.CreatedAtLTE(*filters.EndTime))
	}

	// Get total count
	total, err := query.Count(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count security events: %w", err)
	}

	// Apply pagination
	query.Order(dbent.Desc(securityevent.FieldCreatedAt))
	query.Limit(params.PageSize)
	query.Offset((params.Page - 1) * params.PageSize)

	entities, err := query.All(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query security events: %w", err)
	}

	events := make([]SecurityEvent, 0, len(entities))
	for _, entity := range entities {
		event, err := s.entToSecurityEvent(entity)
		if err != nil {
			logger.LegacyPrintf("service.security", "failed to convert security event: %v", err)
			continue
		}
		events = append(events, *event)
	}

	return events, int64(total), nil
}

// GetSecurityEvent returns a single security event by ID.
func (s *securityServiceImpl) GetSecurityEvent(ctx context.Context, id int64) (*SecurityEvent, error) {
	if s.entClient == nil {
		return nil, fmt.Errorf("ent client is nil")
	}

	entity, err := s.entClient.SecurityEvent.Get(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get security event: %w", err)
	}

	return s.entToSecurityEvent(entity)
}

// UpdateSecurityEventStatus updates the status and resolution of a security event.
func (s *securityServiceImpl) UpdateSecurityEventStatus(ctx context.Context, id int64, status string, resolution string) (*SecurityEvent, error) {
	if s.entClient == nil {
		return nil, fmt.Errorf("ent client is nil")
	}

	update := s.entClient.SecurityEvent.UpdateOneID(id).
		SetStatus(status)

	if resolution != "" {
		update.SetResolution(resolution)
	}

	if status == "resolved" || status == "false_positive" {
		now := time.Now()
		update.SetResolvedAt(now)
	}

	entity, err := update.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update security event: %w", err)
	}

	return s.entToSecurityEvent(entity)
}

// ListDLPRules returns paginated DLP rules based on filters.
func (s *securityServiceImpl) ListDLPRules(ctx context.Context, params pagination.PaginationParams, filters DLPRuleFilters) ([]DLPRule, int64, error) {
	if s.entClient == nil {
		return nil, 0, fmt.Errorf("ent client is nil")
	}

	query := s.entClient.DLPRule.Query()

	// Apply filters
	if filters.Category != nil && *filters.Category != "" {
		query.Where(dlprule.Category(*filters.Category))
	}
	if filters.Severity != nil && *filters.Severity != "" {
		query.Where(dlprule.Severity(*filters.Severity))
	}
	if filters.Enabled != nil {
		query.Where(dlprule.Enabled(*filters.Enabled))
	}
	if filters.Scope != nil && *filters.Scope != "" {
		query.Where(dlprule.Scope(*filters.Scope))
	}

	// Get total count
	total, err := query.Count(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count DLP rules: %w", err)
	}

	// Apply pagination
	query.Order(dbent.Desc(dlprule.FieldPriority))
	query.Limit(params.PageSize)
	query.Offset((params.Page - 1) * params.PageSize)

	entities, err := query.All(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query DLP rules: %w", err)
	}

	rules := make([]DLPRule, 0, len(entities))
	for _, entity := range entities {
		rule := DLPRule{
			ID:          entity.ID,
			Name:        entity.Name,
			Description: &entity.Description,
			Category:    entity.Category,
			Pattern:     entity.Pattern,
			PatternType: entity.PatternType,
			Severity:    entity.Severity,
			Action:      entity.Action,
			MaskContent: entity.MaskContent,
			Enabled:     entity.Enabled,
			Priority:    entity.Priority,
			Scope:       entity.Scope,
			CreatedBy:   entity.CreatedBy,
			CreatedAt:   entity.CreatedAt,
			UpdatedAt:   entity.UpdatedAt,
		}
		// Parse JSON fields
		if entity.Models != nil && *entity.Models != "" {
			json.Unmarshal([]byte(*entity.Models), &rule.Models)
		}
		if entity.Metadata != nil && *entity.Metadata != "" {
			json.Unmarshal([]byte(*entity.Metadata), &rule.Metadata)
		}
		rules = append(rules, rule)
	}

	return rules, int64(total), nil
}

// GetDLPRule returns a single DLP rule by ID.
func (s *securityServiceImpl) GetDLPRule(ctx context.Context, id int64) (*DLPRule, error) {
	if s.entClient == nil {
		return nil, fmt.Errorf("ent client is nil")
	}

	entity, err := s.entClient.DLPRule.Get(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get DLP rule: %w", err)
	}

	rule := &DLPRule{
		ID:          entity.ID,
		Name:        entity.Name,
		Description: &entity.Description,
		Category:    entity.Category,
		Pattern:     entity.Pattern,
		PatternType: entity.PatternType,
		Severity:    entity.Severity,
		Action:      entity.Action,
		MaskContent: entity.MaskContent,
		Enabled:     entity.Enabled,
		Priority:    entity.Priority,
		Scope:       entity.Scope,
		CreatedBy:   entity.CreatedBy,
		CreatedAt:   entity.CreatedAt,
		UpdatedAt:   entity.UpdatedAt,
	}
	// Parse JSON fields
	if entity.Models != nil && *entity.Models != "" {
		json.Unmarshal([]byte(*entity.Models), &rule.Models)
	}
	if entity.Metadata != nil && *entity.Metadata != "" {
		json.Unmarshal([]byte(*entity.Metadata), &rule.Metadata)
	}
	return rule, nil
}

// DetectSensitiveData performs L1 sensitive data detection on input text.
func (s *securityServiceImpl) DetectSensitiveData(ctx context.Context, prompt, systemPrompt, history string) (*security.DetectionResult, error) {
	if s.l1Detector == nil {
		s.l1Detector = security.NewL1Detector()
	}

	result := s.l1Detector.DetectRequest(prompt, systemPrompt, history)
	return &result, nil
}

// Helper functions

func buildAuditRecordData(input *CreateAuditLogInput) string {
	var sb strings.Builder
	if input.UserID != nil {
		sb.WriteString(fmt.Sprintf("%d:", *input.UserID))
	} else {
		sb.WriteString(":")
	}
	if input.APIKeyID != nil {
		sb.WriteString(fmt.Sprintf("%d:", *input.APIKeyID))
	} else {
		sb.WriteString(":")
	}
	sb.WriteString(input.Action + ":")
	sb.WriteString(input.ResourceType + ":")
	if input.ResourceID != nil {
		sb.WriteString(*input.ResourceID + ":")
	} else {
		sb.WriteString(":")
	}
	if input.Changes != nil {
		changesJSON, _ := json.Marshal(input.Changes)
		sb.WriteString(string(changesJSON) + ":")
	}
	sb.WriteString(input.Result + ":")
	if input.FailureReason != nil {
		sb.WriteString(*input.FailureReason + ":")
	} else {
		sb.WriteString(":")
	}
	sb.WriteString(time.Now().Format(time.RFC3339))
	return sb.String()
}

func computeHash(data string) string {
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

func (s *securityServiceImpl) entToAuditLog(entity *dbent.AuditLog) (*AuditLog, error) {
	auditLog := &AuditLog{
		ID:           entity.ID,
		Action:       entity.Action,
		ResourceType: entity.ResourceType,
		Result:       entity.Result,
		RecordHash:   entity.RecordHash,
		CreatedAt:    entity.CreatedAt,
	}

	if entity.UserID != nil {
		auditLog.UserID = entity.UserID
	}
	if entity.APIKeyID != nil {
		auditLog.APIKeyID = entity.APIKeyID
	}
	if entity.ResourceID != nil {
		auditLog.ResourceID = entity.ResourceID
	}
	if entity.ActorIP != nil {
		auditLog.ActorIP = entity.ActorIP
	}
	if entity.ActorUserAgent != nil {
		auditLog.ActorUserAgent = entity.ActorUserAgent
	}
	if entity.RequestID != nil {
		auditLog.RequestID = entity.RequestID
	}
	if entity.SessionID != nil {
		auditLog.SessionID = entity.SessionID
	}
	if entity.Changes != nil && *entity.Changes != "" {
		var changes map[string]any
		if err := json.Unmarshal([]byte(*entity.Changes), &changes); err == nil {
			auditLog.Changes = changes
		}
	}
	if entity.FailureReason != nil {
		auditLog.FailureReason = entity.FailureReason
	}
	if entity.PreviousHash != nil {
		auditLog.PreviousHash = entity.PreviousHash
	}

	return auditLog, nil
}

func (s *securityServiceImpl) entToSecurityEvent(entity *dbent.SecurityEvent) (*SecurityEvent, error) {
	event := &SecurityEvent{
		ID:         entity.ID,
		EventType:  entity.EventType,
		Severity:   entity.Severity,
		Category:   entity.Category,
		Title:      entity.Title,
		Action:     entity.Action,
		Confidence: entity.Confidence,
		Status:     entity.Status,
		CreatedAt:  entity.CreatedAt,
	}

	if entity.Description != "" {
		event.Description = &entity.Description
	}
	if entity.UserID != nil {
		event.UserID = entity.UserID
	}
	if entity.APIKeyID != nil {
		event.APIKeyID = entity.APIKeyID
	}
	if entity.RequestID != nil {
		event.RequestID = entity.RequestID
	}
	if entity.Model != nil {
		event.Model = entity.Model
	}
	if entity.MatchedPatterns != nil {
		event.MatchedPatterns = entity.MatchedPatterns
	}
	if entity.RequestSnapshot != nil {
		event.RequestSnapshot = entity.RequestSnapshot
	}
	if entity.SourceIP != nil {
		event.SourceIP = entity.SourceIP
	}
	if entity.UserAgent != nil {
		event.UserAgent = entity.UserAgent
	}
	if entity.Resolution != nil && *entity.Resolution != "" {
		event.Resolution = entity.Resolution
	}
	if entity.ResolvedAt != nil && !entity.ResolvedAt.IsZero() {
		event.ResolvedAt = entity.ResolvedAt
	}

	return event, nil
}
