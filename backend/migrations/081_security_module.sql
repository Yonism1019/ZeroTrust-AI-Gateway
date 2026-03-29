-- Security Module Tables
-- Phase 1: Core Security Infrastructure
-- Migration ID: 081

-- =====================================================
-- Security Events Table
-- Records detected security threats and policy violations
-- =====================================================
CREATE TABLE IF NOT EXISTS security_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(20) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id BIGINT,
    api_key_id BIGINT,
    request_id VARCHAR(64),
    model VARCHAR(100),
    action VARCHAR(20) DEFAULT 'allow',
    matched_patterns TEXT,
    confidence DECIMAL(5,4) DEFAULT 0.0,
    request_snapshot TEXT,
    source_ip VARCHAR(45),
    user_agent VARCHAR(512),
    status VARCHAR(20) DEFAULT 'new',
    resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Indexes for security_events
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_category ON security_events(category);
CREATE INDEX IF NOT EXISTS idx_security_events_status ON security_events(status);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_api_key_id ON security_events(api_key_id);
CREATE INDEX IF NOT EXISTS idx_security_events_action ON security_events(action);
CREATE INDEX IF NOT EXISTS idx_security_events_status_created ON security_events(status, created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity_created ON security_events(severity, created_at);

-- =====================================================
-- Audit Logs Table
-- Immutable audit trail with hash chain for compliance
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    api_key_id BIGINT,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(64),
    actor_ip VARCHAR(45),
    actor_user_agent VARCHAR(512),
    request_id VARCHAR(64),
    session_id VARCHAR(64),
    changes JSONB,
    result VARCHAR(20) DEFAULT 'success',
    failure_reason VARCHAR(255),
    previous_hash VARCHAR(64),
    record_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_api_key_id ON audit_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_result ON audit_logs(result);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_composite ON audit_logs(resource_type, resource_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created ON audit_logs(action, created_at);

-- =====================================================
-- DLP Rules Table
-- Configurable Data Loss Prevention rules
-- =====================================================
CREATE TABLE IF NOT EXISTS dlp_rules (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    pattern TEXT NOT NULL,
    pattern_type VARCHAR(20) DEFAULT 'regex',
    severity VARCHAR(20) DEFAULT 'high',
    action VARCHAR(20) DEFAULT 'block',
    mask_content BOOLEAN DEFAULT FALSE,
    enabled BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    scope VARCHAR(20) DEFAULT 'all',
    models JSONB,
    metadata JSONB,
    created_by BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dlp_rules
CREATE INDEX IF NOT EXISTS idx_dlp_rules_category ON dlp_rules(category);
CREATE INDEX IF NOT EXISTS idx_dlp_rules_enabled ON dlp_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_dlp_rules_severity ON dlp_rules(severity);
CREATE INDEX IF NOT EXISTS idx_dlp_rules_priority ON dlp_rules(priority);
CREATE INDEX IF NOT EXISTS idx_dlp_rules_scope ON dlp_rules(scope);

-- =====================================================
-- Seed Default DLP Rules
-- =====================================================
INSERT INTO dlp_rules (name, description, category, pattern, pattern_type, severity, action, enabled, priority) VALUES
    ('OpenAI API Key', 'Detects OpenAI API keys', 'api_key', 'sk-[A-Za-z0-9]{48}', 'regex', 'critical', 'block', true, 100),
    ('AWS Access Key', 'Detects AWS access key IDs', 'api_key', 'AKIA[A-Z0-9]{16}', 'regex', 'critical', 'block', true, 100),
    ('AWS Secret Key', 'Detects AWS secret access keys', 'api_key', 'AWS[A-Za-z0-9/+=]{40}', 'regex', 'critical', 'block', true, 100),
    ('Generic API Key', 'Detects generic API key patterns', 'api_key', '(?i)(api[_-]?key|apikey|api-secret)[''"]?\s*[:=]\s*[''"]?[A-Za-z0-9_-]{20,}', 'regex', 'high', 'warn', true, 50),
    ('MySQL Connection', 'Detects MySQL JDBC connection strings', 'database', 'jdbc:mysql://[^\s]+', 'regex', 'critical', 'block', true, 90),
    ('PostgreSQL Connection', 'Detects PostgreSQL connection strings', 'database', 'postgres://[^\s]+', 'regex', 'critical', 'block', true, 90),
    ('MongoDB Connection', 'Detects MongoDB connection strings', 'database', 'mongodb://[^\s]+', 'regex', 'critical', 'block', true, 90),
    ('Redis Connection', 'Detects Redis connection strings', 'database', 'redis://[^\s]+', 'regex', 'high', 'warn', true, 80),
    ('SSH Private Key', 'Detects SSH private key headers', 'secret', '-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----', 'regex', 'critical', 'block', true, 100),
    ('GitHub Token', 'Detects GitHub personal access tokens', 'api_key', 'ghp_[A-Za-z0-9]{36}', 'regex', 'high', 'warn', true, 80),
    ('JSON Web Token', 'Detects JWT tokens', 'token', 'eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+', 'regex', 'medium', 'log', true, 30),
    ('Phone Number CN', 'Detects Chinese phone numbers', 'pii', '1[3-9]\d{9}', 'regex', 'medium', 'mask', true, 20),
    ('Email Address', 'Detects email addresses', 'pii', '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', 'regex', 'low', 'log', true, 10),
    ('ID Card CN', 'Detects Chinese ID card numbers', 'pii', '[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]', 'regex', 'high', 'warn', true, 60),
    ('Credit Card', 'Detects credit card numbers', 'pii', '\b(?:\d[ -]*?){13,16}\b', 'regex', 'high', 'mask', true, 70)
ON CONFLICT DO NOTHING;
