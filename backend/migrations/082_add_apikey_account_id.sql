-- +迁移名称: 082_add_apikey_account_id
-- +迁移描述: 为api_keys表添加account_id字段，实现API密钥与上游账户的绑定
-- +创建时间: 2026-03-29

-- 添加 account_id 字段到 api_keys 表
-- 该字段用于绑定API密钥到特定的上游账户（Account）
-- 例如：用户A创建了一个API密钥，指定使用他在OpenAI的账户

ALTER TABLE api_keys
ADD COLUMN IF NOT EXISTS account_id BIGINT;

-- 添加外键约束（如果 account 存在的话）
-- 注意：如果 accounts 表还没有这个列，外键会创建失败
-- 这是预期的，因为我们只是在扩展 api_keys 表

-- 为 account_id 添加索引，提升按账户查询API密钥的性能
CREATE INDEX IF NOT EXISTS idx_api_keys_account_id ON api_keys(account_id);

-- 添加注释
COMMENT ON COLUMN api_keys.account_id IS 'Bound upstream account ID for this API key';