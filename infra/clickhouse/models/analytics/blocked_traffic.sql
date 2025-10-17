-- ============================================================================
-- Blocked Traffic Table
-- ============================================================================
-- Records of blocked requests, bots, and suspicious traffic patterns
-- Includes TTL for automatic cleanup after 6 months
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics.blocked_traffic (
    id UUID,
    client_id String,
    timestamp DateTime64(3, 'UTC'),
    
    -- Request information
    path Nullable(String),
    url Nullable(String),
    referrer Nullable(String),
    method LowCardinality(String) DEFAULT 'POST',
    origin Nullable(String),
    
    -- Client information
    ip String,
    user_agent Nullable(String),
    accept_header Nullable(String),
    language Nullable(String),
    
    -- Blocking details
    block_reason LowCardinality(String),
    block_category LowCardinality(String),
    bot_name Nullable(String),
    
    -- Geographic information
    country Nullable(String),
    region Nullable(String),
    
    -- Device information
    browser_name Nullable(String),
    browser_version Nullable(String),
    os_name Nullable(String),
    os_version Nullable(String),
    device_type Nullable(String),
    
    -- Request details
    payload_size Nullable(UInt32),
    
    created_at DateTime64(3, 'UTC') DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, client_id, id)
TTL toDateTime(timestamp) + INTERVAL 6 MONTH
SETTINGS index_granularity = 8192;
