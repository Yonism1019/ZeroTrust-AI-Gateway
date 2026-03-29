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

// AuditLog records immutable audit trail with hash chain for compliance.
type AuditLog struct {
	ent.Schema
}

// Annotations returns schema annotations.
func (AuditLog) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "audit_logs"},
	}
}

// Fields defines all fields for AuditLog.
func (AuditLog) Fields() []ent.Field {
	return []ent.Field{
		// User context
		field.Int64("user_id").
			Optional().
			Nillable(),
		field.Int64("api_key_id").
			Optional().
			Nillable(),

		// Action type: create, read, update, delete, execute, login, logout, etc.
		field.String("action").
			MaxLen(50).
			NotEmpty(),

		// Resource type: api_key, user, account, policy, config, etc.
		field.String("resource_type").
			MaxLen(50).
			NotEmpty(),

		// Resource identifier
		field.String("resource_id").
			MaxLen(64).
			Optional().
			Nillable(),

		// Actor info
		field.String("actor_ip").
			MaxLen(45).
			Optional().
			Nillable(),
		field.String("actor_user_agent").
			MaxLen(512).
			Optional().
			Nillable(),

		// Request context
		field.String("request_id").
			MaxLen(64).
			Optional().
			Nillable(),
		field.String("session_id").
			MaxLen(64).
			Optional().
			Nillable(),

		// Change details
		field.String("changes").
			SchemaType(map[string]string{dialect.Postgres: "jsonb"}).
			Optional().
			Nillable().
			Comment("JSON object with before/after values"),

		// Result
		field.String("result").
			MaxLen(20).
			Default("success").
			Comment("success, failure, partial"),

		// Failure reason
		field.String("failure_reason").
			MaxLen(255).
			Optional().
			Nillable(),

		// Hash chain for integrity
		field.String("previous_hash").
			MaxLen(64).
			Optional().
			Nillable().
			Comment("Hash of previous record for chain verification"),

		field.String("record_hash").
			MaxLen(64).
			NotEmpty().
			Comment("SHA-256 hash of this record's data"),

		// Timestamp
		field.Time("created_at").
			Default(time.Now).
			Immutable().
			SchemaType(map[string]string{dialect.Postgres: "timestamptz"}),
	}
}

// Edges defines relationships.
func (AuditLog) Edges() []ent.Edge {
	return []ent.Edge{}
}

// Indexes defines database indexes.
func (AuditLog) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("action"),
		index.Fields("resource_type"),
		index.Fields("resource_id"),
		index.Fields("created_at"),
		index.Fields("user_id"),
		index.Fields("api_key_id"),
		index.Fields("result"),
		// Compound indexes
		index.Fields("resource_type", "resource_id", "created_at"),
		index.Fields("user_id", "created_at"),
		index.Fields("action", "created_at"),
	}
}
