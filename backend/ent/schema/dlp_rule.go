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

// DLPRule defines Data Loss Prevention rules for detecting sensitive data.
type DLPRule struct {
	ent.Schema
}

// Annotations returns schema annotations.
func (DLPRule) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "dlp_rules"},
	}
}

// Fields defines all fields for DLPRule.
func (DLPRule) Fields() []ent.Field {
	return []ent.Field{
		// Rule name
		field.String("name").
			MaxLen(100).
			NotEmpty(),

		// Rule description
		field.String("description").
			SchemaType(map[string]string{dialect.Postgres: "text"}),

		// Category of sensitive data
		field.String("category").
			MaxLen(50).
			NotEmpty().
			Comment("e.g., api_key, password, credit_card, ssn, phone, email, custom"),

		// Detection pattern - regex or keyword list (JSON)
		field.String("pattern").
			SchemaType(map[string]string{dialect.Postgres: "text"}).
			NotEmpty().
			Comment("Regex pattern or JSON array of keywords"),

		// Pattern type: regex, keyword, pattern_match
		field.String("pattern_type").
			MaxLen(20).
			Default("regex").
			Comment("regex, keyword, ac自动机"),

		// Severity when matched
		field.String("severity").
			MaxLen(20).
			Default("high").
			Comment("critical, high, medium, low"),

		// Action when detected: block, warn, log
		field.String("action").
			MaxLen(20).
			Default("block"),

		// Whether to mask/redact the detected content
		field.Bool("mask_content").
			Default(false),

		// Is the rule enabled
		field.Bool("enabled").
			Default(true),

		// Priority (higher = checked first)
		field.Int("priority").
			Default(0),

		// Scope: applies to all or specific groups
		field.String("scope").
			MaxLen(20).
			Default("all").
			Comment("all, group, user, api_key"),

		// Applies to specific models (empty = all models)
		field.String("models").
			SchemaType(map[string]string{dialect.Postgres: "jsonb"}).
			Optional().
			Nillable().
			Comment("JSON array of model names, empty means all"),

		// Custom metadata
		field.String("metadata").
			SchemaType(map[string]string{dialect.Postgres: "jsonb"}).
			Optional().
			Nillable(),

		// Created/updated by
		field.Int64("created_by").
			Optional().
			Nillable(),

		// Timestamps
		field.Time("created_at").
			Default(time.Now).
			Immutable().
			SchemaType(map[string]string{dialect.Postgres: "timestamptz"}),

		field.Time("updated_at").
			Default(time.Now).
			SchemaType(map[string]string{dialect.Postgres: "timestamptz"}),
	}
}

// Edges defines relationships.
func (DLPRule) Edges() []ent.Edge {
	return []ent.Edge{}
}

// Indexes defines database indexes.
func (DLPRule) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("category"),
		index.Fields("enabled"),
		index.Fields("severity"),
		index.Fields("priority"),
		index.Fields("scope"),
	}
}
