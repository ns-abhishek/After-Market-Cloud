-- Notification Center Database Schema

-- Users table
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    preferred_language VARCHAR(10) DEFAULT 'en',
    time_zone VARCHAR(50) DEFAULT 'UTC'
);

-- User devices for push notifications
CREATE TABLE user_devices (
    device_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    device_type VARCHAR(20) NOT NULL, -- 'mobile', 'desktop', 'tablet'
    device_name VARCHAR(100),
    push_token VARCHAR(255),
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Notification categories
CREATE TABLE notification_categories (
    category_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    icon VARCHAR(50),
    color VARCHAR(20),
    is_system BOOLEAN DEFAULT FALSE
);

-- Insert default categories
INSERT INTO notification_categories (category_id, name, description, icon, color, is_system)
VALUES 
('system', 'System', 'System notifications', 'computer', '#6B7280', TRUE),
('meeting', 'Meeting', 'Meeting requests and updates', 'calendar', '#4F46E5', TRUE),
('task', 'Task', 'Task assignments and reminders', 'clipboard', '#10B981', TRUE),
('social', 'Social', 'Social interactions and updates', 'users', '#F59E0B', TRUE),
('security', 'Security', 'Security alerts and updates', 'shield', '#EF4444', TRUE),
('update', 'Update', 'Application and system updates', 'refresh', '#0EA5E9', TRUE);

-- Notifications table
CREATE TABLE notifications (
    notification_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT,
    category_id VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(20) NOT NULL, -- 'unread', 'read', 'archived', 'deleted'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    archived_at TIMESTAMP,
    deleted_at TIMESTAMP,
    expires_at TIMESTAMP,
    source_app VARCHAR(100),
    source_id VARCHAR(100),
    is_starred BOOLEAN DEFAULT FALSE,
    is_draft BOOLEAN DEFAULT FALSE,
    is_awaiting BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP,
    reminder_time TIMESTAMP,
    interaction_score FLOAT, -- ML-derived score
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES notification_categories(category_id)
);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX idx_notifications_category ON notifications(category_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Notification metadata (flexible key-value storage)
CREATE TABLE notification_metadata (
    notification_id VARCHAR(100) NOT NULL,
    meta_key VARCHAR(50) NOT NULL,
    meta_value TEXT,
    PRIMARY KEY (notification_id, meta_key),
    FOREIGN KEY (notification_id) REFERENCES notifications(notification_id) ON DELETE CASCADE
);

-- Notification tags
CREATE TABLE notification_tags (
    notification_id VARCHAR(100) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (notification_id, tag),
    FOREIGN KEY (notification_id) REFERENCES notifications(notification_id) ON DELETE CASCADE
);

-- Notification actions (buttons, links, etc.)
CREATE TABLE notification_actions (
    action_id VARCHAR(100) PRIMARY KEY,
    notification_id VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'link', 'button', 'form', 'approve', 'decline', 'schedule', 'custom'
    label VARCHAR(100) NOT NULL,
    value VARCHAR(255),
    url VARCHAR(255),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES notifications(notification_id) ON DELETE CASCADE
);

-- Related notifications (for threading)
CREATE TABLE related_notifications (
    parent_notification_id VARCHAR(100) NOT NULL,
    child_notification_id VARCHAR(100) NOT NULL,
    relationship_type VARCHAR(20) DEFAULT 'related', -- 'related', 'reply', 'update', 'thread'
    PRIMARY KEY (parent_notification_id, child_notification_id),
    FOREIGN KEY (parent_notification_id) REFERENCES notifications(notification_id) ON DELETE CASCADE,
    FOREIGN KEY (child_notification_id) REFERENCES notifications(notification_id) ON DELETE CASCADE
);

-- User interactions with notifications
CREATE TABLE notification_interactions (
    interaction_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    notification_id VARCHAR(100) NOT NULL,
    action_id VARCHAR(100),
    interaction_type VARCHAR(20) NOT NULL, -- 'viewed', 'read', 'clicked', 'dismissed', 'snoozed', 'archived', 'deleted', 'starred', etc.
    interaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_id VARCHAR(100),
    duration_ms INTEGER, -- Time spent viewing/interacting
    metadata TEXT, -- JSON data for additional context
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (notification_id) REFERENCES notifications(notification_id) ON DELETE CASCADE,
    FOREIGN KEY (action_id) REFERENCES notification_actions(action_id) ON DELETE SET NULL,
    FOREIGN KEY (device_id) REFERENCES user_devices(device_id) ON DELETE SET NULL
);

-- Create index for faster analytics
CREATE INDEX idx_interactions_user ON notification_interactions(user_id);
CREATE INDEX idx_interactions_notification ON notification_interactions(notification_id);
CREATE INDEX idx_interactions_time ON notification_interactions(interaction_time);

-- User preferences
CREATE TABLE user_preferences (
    user_id VARCHAR(50) PRIMARY KEY,
    notification_delivery JSON, -- {"email": true, "push": true, "in_app": true, "sms": false}
    quiet_hours JSON, -- {"enabled": true, "start": "22:00", "end": "07:00", "days": [0,1,2,3,4,5,6]}
    digest_preferences JSON, -- {"enabled": true, "frequency": "daily", "time": "08:00", "days": [1,3,5]}
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Category preferences per user
CREATE TABLE user_category_preferences (
    user_id VARCHAR(50) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    priority VARCHAR(20) DEFAULT 'medium',
    delivery_channels JSON, -- ["email", "push", "in_app"]
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES notification_categories(category_id) ON DELETE CASCADE
);

-- Calendar events (for meeting integration)
CREATE TABLE calendar_events (
    event_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255),
    is_all_day BOOLEAN DEFAULT FALSE,
    recurrence VARCHAR(50), -- 'none', 'daily', 'weekly', 'monthly', 'yearly'
    recurrence_rule TEXT, -- iCalendar RRULE format
    notification_id VARCHAR(100), -- Associated notification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (notification_id) REFERENCES notifications(notification_id) ON DELETE SET NULL
);

-- Calendar event attendees
CREATE TABLE calendar_event_attendees (
    event_id VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100),
    response_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'tentative'
    is_organizer BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (event_id, email),
    FOREIGN KEY (event_id) REFERENCES calendar_events(event_id) ON DELETE CASCADE
);

-- Iterative tasks
CREATE TABLE iterative_tasks (
    task_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_day INTEGER, -- 0-6 for day of week, NULL for every day
    due_time TIME,
    last_completed TIMESTAMP,
    completion_rate FLOAT,
    category_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES notification_categories(category_id)
);

-- Iterative task completion history
CREATE TABLE iterative_task_completions (
    completion_id VARCHAR(100) PRIMARY KEY,
    task_id VARCHAR(100) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_by VARCHAR(50) NOT NULL,
    FOREIGN KEY (task_id) REFERENCES iterative_tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (completed_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ML model data
CREATE TABLE ml_user_behavior (
    user_id VARCHAR(50) PRIMARY KEY,
    preferred_notification_time JSON, -- {"morning": 15, "afternoon": 35, "evening": 50}
    category_interactions JSON, -- {"meeting": {"viewed": 42, "actioned": 38}, ...}
    priority_responses JSON, -- {"low": {"viewed": 25, "actioned": 15}, ...}
    response_time_by_priority JSON, -- {"low": [300000, 250000, ...], ...} (in ms)
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ML suggestions
CREATE TABLE ml_suggestions (
    suggestion_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'category_focus', 'time_preference', 'priority_focus', etc.
    message TEXT NOT NULL,
    data JSON, -- Additional data for the suggestion
    is_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Views for common queries

-- Unread notifications view
CREATE VIEW unread_notifications AS
SELECT n.*, c.name as category_name, c.icon as category_icon, c.color as category_color
FROM notifications n
JOIN notification_categories c ON n.category_id = c.category_id
WHERE n.status = 'unread' AND n.deleted_at IS NULL;

-- Today's calendar events
CREATE VIEW today_calendar_events AS
SELECT e.*, u.display_name as user_name
FROM calendar_events e
JOIN users u ON e.user_id = u.user_id
WHERE DATE(e.start_time) = CURRENT_DATE
ORDER BY e.start_time;

-- Due iterative tasks
CREATE VIEW due_iterative_tasks AS
SELECT t.*, u.display_name as user_name
FROM iterative_tasks t
JOIN users u ON t.user_id = u.user_id
WHERE 
    (t.due_day IS NULL OR t.due_day = EXTRACT(DOW FROM CURRENT_DATE))
    AND (t.last_completed IS NULL OR DATE(t.last_completed) < CURRENT_DATE);

-- User engagement metrics
CREATE VIEW user_engagement_metrics AS
SELECT 
    u.user_id,
    u.display_name,
    COUNT(DISTINCT n.notification_id) as total_notifications,
    COUNT(DISTINCT CASE WHEN n.status = 'read' THEN n.notification_id END) as read_notifications,
    COUNT(DISTINCT CASE WHEN n.is_starred THEN n.notification_id END) as starred_notifications,
    COUNT(DISTINCT i.interaction_id) as total_interactions,
    ROUND(COUNT(DISTINCT CASE WHEN n.status = 'read' THEN n.notification_id END)::NUMERIC / 
          NULLIF(COUNT(DISTINCT n.notification_id), 0)::NUMERIC * 100, 2) as read_rate
FROM users u
LEFT JOIN notifications n ON u.user_id = n.user_id
LEFT JOIN notification_interactions i ON n.notification_id = i.notification_id
GROUP BY u.user_id, u.display_name;

-- Sample data insertion function
CREATE OR REPLACE FUNCTION insert_sample_data()
RETURNS VOID AS $$
DECLARE
    user_id_val VARCHAR(50);
    notification_id_val VARCHAR(100);
    action_id_val VARCHAR(100);
    event_id_val VARCHAR(100);
    task_id_val VARCHAR(100);
BEGIN
    -- Insert sample user
    INSERT INTO users (user_id, email, display_name)
    VALUES ('user1', 'user@example.com', 'Sample User')
    RETURNING user_id INTO user_id_val;
    
    -- Insert sample device
    INSERT INTO user_devices (device_id, user_id, device_type, device_name)
    VALUES ('device1', user_id_val, 'desktop', 'Work Computer');
    
    -- Insert sample notification
    INSERT INTO notifications (
        notification_id, user_id, title, body, category_id, 
        priority, status, is_starred
    )
    VALUES (
        'notif1', user_id_val, 'Quarterly Review Meeting', 
        'John Doe has requested a meeting for the Q2 performance review. Please approve or suggest an alternative time.',
        'meeting', 'high', 'unread', TRUE
    )
    RETURNING notification_id INTO notification_id_val;
    
    -- Insert notification tags
    INSERT INTO notification_tags (notification_id, tag)
    VALUES 
    (notification_id_val, 'meeting'),
    (notification_id_val, 'review');
    
    -- Insert notification actions
    INSERT INTO notification_actions (action_id, notification_id, type, label)
    VALUES 
    ('action1', notification_id_val, 'approve', 'Approve'),
    ('action2', notification_id_val, 'decline', 'Decline'),
    ('action3', notification_id_val, 'schedule', 'Suggest Time')
    RETURNING action_id INTO action_id_val;
    
    -- Insert calendar event
    INSERT INTO calendar_events (
        event_id, user_id, title, description, 
        start_time, end_time, location, notification_id
    )
    VALUES (
        'event1', user_id_val, 'Quarterly Review Meeting',
        'Q2 performance review discussion',
        NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 1 hour',
        'Conference Room A', notification_id_val
    )
    RETURNING event_id INTO event_id_val;
    
    -- Insert event attendees
    INSERT INTO calendar_event_attendees (event_id, email, name, is_organizer)
    VALUES 
    (event_id_val, 'john@example.com', 'John Doe', TRUE),
    (event_id_val, 'user@example.com', 'Sample User', FALSE);
    
    -- Insert iterative task
    INSERT INTO iterative_tasks (
        task_id, user_id, title, description,
        due_day, due_time, category_id
    )
    VALUES (
        'task1', user_id_val, 'Weekly Report Submission',
        'Submit weekly progress report',
        5, '17:00:00', 'task'
    )
    RETURNING task_id INTO task_id_val;
    
    -- Insert ML behavior data
    INSERT INTO ml_user_behavior (
        user_id, preferred_notification_time, 
        category_interactions, priority_responses
    )
    VALUES (
        user_id_val,
        '{"morning": 15, "afternoon": 35, "evening": 50}'::JSON,
        '{"meeting": {"viewed": 42, "actioned": 38}, "system": {"viewed": 30, "actioned": 25}}'::JSON,
        '{"low": {"viewed": 25, "actioned": 15}, "medium": {"viewed": 40, "actioned": 30}, "high": {"viewed": 35, "actioned": 32}, "urgent": {"viewed": 20, "actioned": 19}}'::JSON
    );
    
    -- Insert ML suggestion
    INSERT INTO ml_suggestions (
        suggestion_id, user_id, type, message, data
    )
    VALUES (
        'sugg1', user_id_val, 'time_preference',
        'You tend to respond to notifications in the evening. Schedule non-urgent notifications for this time?',
        '{"timeOfDay": "evening"}'::JSON
    );
END;
$$ LANGUAGE plpgsql;

-- Execute the sample data insertion
SELECT insert_sample_data();
