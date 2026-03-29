-- Add security level configuration to groups
-- Allows configuring which detection levels (L1/L2/L3) are enabled per group

ALTER TABLE groups ADD COLUMN IF NOT EXISTS security_level VARCHAR(20) DEFAULT 'basic';
ALTER TABLE groups ADD COLUMN IF NOT EXISTS l1_enabled BOOLEAN DEFAULT true;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS l2_enabled BOOLEAN DEFAULT false;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS l3_enabled BOOLEAN DEFAULT false;

COMMENT ON COLUMN groups.security_level IS 'Security level: none, basic, standard, strict';
COMMENT ON COLUMN groups.l1_enabled IS 'L1 detection enabled (API key, DB connection, private key)';
COMMENT ON COLUMN groups.l2_enabled IS 'L2 detection enabled (NER-based PII detection)';
COMMENT ON COLUMN groups.l3_enabled IS 'L3 detection enabled (semantic risk assessment)';

CREATE INDEX IF NOT EXISTS idx_groups_security_level ON groups(security_level);
