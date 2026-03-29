// Package schema defines Ent ORM database schemas for ZeroTrust AI Gateway security module.
package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// SecurityEvent records detected security threats and policy violations.
type SecurityEvent struct {
	ent.Schema
}

// Annotations returns schema annotations.
func (SecurityEvent) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "security_events"},
	}
}

// Fields defines all fields for SecurityEvent.
func (SecurityEvent) Fields() []ent.Field {
	return []ent.Field{
		// Event type: L1, L2, L3 detection
		field.String("event_type").
			MaxLen(20).
			NotEmpty().
			Comment("Detection level: L1/L2/L3"),

		// Severity: critical, high, medium, low, info
		field.String("severity").
			MaxLen(20).
			NotEmpty(),

		// Category: sensitive_data, shadow_ai, dangerous_instruction, cost_anomaly, etc.
		field.String("category").
			MaxLen(50).
			NotEmpty(),

		// Event title for quick identification
		field.String("title").
			MaxLen(255).
			NotEmpty(),

		// Detailed description
		field.String("description").
			SchemaType(map[string]string{dialect.Postgres: "text"}),

		// Request context
		field.Int64("user_id").
			Optional().
			Nillable(),
		field.Int64("api_key_id").
			Optional().
			Nillable(),
		field.String("request_id").
			MaxLen(64).
			Optional().
			Nillable(),

		// Model involved
		field.String("model").
			MaxLen(100).
			Optional().
			Nillable(),

		// Detection result
		field.String("action").
			MaxLen(20).
			Default("allow").
			Comment("Action taken: allow, block, warn, log"),

		// Matched patterns (for L1 detection)
		field.String("matched_patterns").
			SchemaType(map[string]string{dialect.Postgres: "text"}).
			Optional().
			Nillable().
			Comment("JSON array of matched sensitive data patterns"),

		// Confidence score (0.0 - 1.0)
		field.Float("confidence").
			Default(0.0).
			SchemaType(map[string]string{dialect.Postgres: "decimal(5,4)"}),

		// Raw request data snapshot (truncated, for forensics)
		field.String("request_snapshot").
			SchemaType(map[string]string{dialect.Postgres: "text"}).
			Optional().
			Nillable(),

		// Source info
		field.String("source_ip").
			MaxLen(45).
			Optional().
			Nillable(),
		field.String("user_agent").
			MaxLen(512).
			Optional().
			Nillable(),

		// Status: new, investigating, resolved, false_positive
		field.String("status").
			MaxLen(20).
			Default("new"),

		// Resolution notes
		field.String("resolution").
			SchemaType(map[string]string{dialect.Postgres: "text"}).
			Optional().
			Nillable(),

		// Timestamps
		field.Time("created_at").
			Default(time.Now).
			Immutable().
			SchemaType(map[string]string{dialect.Postgres: "timestamptz"}),

		field.Time("resolved_at").
			Optional().
			Nillable().
			SchemaType(map[string]string{dialect.Postgres: "timestamptz"}),
	}
}

// Edges defines relationships.
func (SecurityEvent) Edges() []ent.Edge {
	return []ent.Edge{}
}

// Indexes defines database indexes.
func (SecurityEvent) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("event_type"),
		index.Fields("severity"),
		index.Fields("category"),
		index.Fields("status"),
		index.Fields("created_at"),
		index.Fields("user_id"),
		index.Fields("api_key_id"),
		index.Fields("action"),
		// Compound indexes for common queries
		index.Fields("status", "created_at"),
		index.Fields("severity", "created_at"),
	}
}
