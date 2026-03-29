package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/pkg/ctxkey"
	"github.com/Wei-Shaw/sub2api/internal/security"
	"github.com/Wei-Shaw/sub2api/internal/service"

	"github.com/gin-gonic/gin"
)

// SecurityGuardMiddleware provides L1/L2/L3 security detection for AI gateway requests.
type SecurityGuardMiddleware struct {
	securityService service.SecurityService
	l1Detector      *security.L1Detector
	enabled         bool
}

// NewSecurityGuardMiddleware creates a new SecurityGuardMiddleware.
func NewSecurityGuardMiddleware(securityService service.SecurityService) *SecurityGuardMiddleware {
	return &SecurityGuardMiddleware{
		securityService: securityService,
		l1Detector:      security.NewL1Detector(),
		enabled:         true,
	}
}

// L1Guard returns a middleware that performs L1 (pattern-based) sensitive data detection.
func (m *SecurityGuardMiddleware) L1Guard() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !m.enabled {
			c.Next()
			return
		}

		// Only check POST requests with JSON body
		if c.Request.Method != http.MethodPost {
			c.Next()
			return
		}

		// Get request ID for tracing
		requestID, _ := c.Get(string(ctxkey.RequestID))
		requestIDStr, _ := requestID.(string)

		// Extract prompt from request body
		prompt, systemPrompt, err := m.extractPrompts(c)
		if err != nil || prompt == "" {
			// Not a prompt-containing request, skip
			c.Next()
			return
		}

		// Perform L1 detection
		result := m.l1Detector.DetectRequest(prompt, systemPrompt, "")

		if result.Matched {
			// Get user and API key info from context
			authSubject, _ := GetAuthSubjectFromContext(c)
			apiKey, _ := GetAPIKeyFromContext(c)

			var userIDPtr, apiKeyIDPtr *int64
			if authSubject.UserID > 0 {
				uid := authSubject.UserID
				userIDPtr = &uid
			}
			var akeyID int64
			if apiKey != nil {
				akeyID = apiKey.ID
				apiKeyIDPtr = &akeyID
			}

			// Get client info
			clientIP := c.ClientIP()
			userAgent := c.Request.UserAgent()

			// Record matched patterns
			matchedPatternsJSON, _ := json.Marshal(result.Patterns)

			// Create security event
			eventInput := &service.CreateSecurityEventInput{
				EventType:       "L1",
				Severity:        result.Severity,
				Category:        "sensitive_data",
				Title:           "Sensitive Data Detected",
				Description:     stringPtr("L1 detection found sensitive data in request"),
				UserID:          userIDPtr,
				APIKeyID:        apiKeyIDPtr,
				RequestID:       &requestIDStr,
				Action:          result.Action,
				MatchedPatterns: stringPtr(string(matchedPatternsJSON)),
				Confidence:      result.Confidence,
				SourceIP:        &clientIP,
				UserAgent:       &userAgent,
			}

			// Log the security event asynchronously
			go func() {
				if m.securityService != nil {
					ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
					defer cancel()
					_, _ = m.securityService.CreateSecurityEvent(ctx, eventInput)
				}
			}()

			// Create audit log entry
			auditInput := &service.CreateAuditLogInput{
				UserID:         userIDPtr,
				APIKeyID:       apiKeyIDPtr,
				Action:         "execute",
				ResourceType:   "ai_request",
				ActorIP:        &clientIP,
				ActorUserAgent: &userAgent,
				RequestID:      &requestIDStr,
				Changes: map[string]any{
					"detected":   true,
					"categories": result.Categories,
					"severity":   result.Severity,
					"action":     result.Action,
				},
				Result: "success",
			}

			go func() {
				if m.securityService != nil {
					ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
					defer cancel()
					_, _ = m.securityService.CreateAuditLog(ctx, auditInput)
				}
			}()

			// Handle based on action
			switch result.Action {
			case "block":
				c.JSON(http.StatusForbidden, gin.H{
					"error": gin.H{
						"type":    "security_policy_violation",
						"message": "Request blocked due to sensitive data detection",
						"code":    "SENSITIVE_DATA_DETECTED",
					},
				})
				c.Abort()
				return
			case "warn":
				// Add warning header but continue
				c.Header("X-Security-Warning", "Sensitive data detected in request")
			case "log":
				// Just log and continue
			}
		}

		c.Next()
	}
}

// L2Guard returns a middleware that performs L2 (semantic) detection.
// This is a placeholder for future L2 implementation.
func (m *SecurityGuardMiddleware) L2Guard() gin.HandlerFunc {
	return func(c *gin.Context) {
		// L2 requires AI model inference, defer to handler layer
		c.Next()
	}
}

// L3Guard returns a middleware that performs L3 (behavioral) detection.
// This is a placeholder for future L3 implementation.
func (m *SecurityGuardMiddleware) L3Guard() gin.HandlerFunc {
	return func(c *gin.Context) {
		// L3 requires analytics, defer to handler layer
		c.Next()
	}
}

// extractPrompts extracts prompt and system prompt from the request body.
func (m *SecurityGuardMiddleware) extractPrompts(c *gin.Context) (prompt, systemPrompt string, err error) {
	contentType := c.ContentType()

	// Try to extract from JSON body
	if strings.Contains(contentType, "application/json") {
		var body map[string]any
		if err := c.ShouldBindJSON(&body); err != nil {
			return "", "", err
		}

		// Handle OpenAI format
		if messages, ok := body["messages"].([]any); ok {
			for _, msg := range messages {
				if msgMap, ok := msg.(map[string]any); ok {
					role, _ := msgMap["role"].(string)
					content, _ := msgMap["content"].(string)
					if content == "" {
						continue
					}
					switch role {
					case "system":
						systemPrompt += content + "\n"
					case "user":
						prompt += content + "\n"
					case "assistant":
						prompt += content + "\n"
					}
				}
			}
		}

		// Also check for direct prompt field
		if prompt == "" {
			if p, ok := body["prompt"].(string); ok {
				prompt = p
			}
		}
		if systemPrompt == "" {
			if sp, ok := body["system"].(string); ok {
				systemPrompt = sp
			}
		}
	}

	return prompt, systemPrompt, nil
}

// stringPtr is a helper to get a pointer to a string literal.
func stringPtr(s string) *string {
	return &s
}
