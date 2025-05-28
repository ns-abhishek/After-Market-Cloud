// Database Connection Module for Notification Center

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'notification_center',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password'
    };
  }

  // Initialize the database connection
  async connect() {
    try {
      // In a real implementation, this would use a library like pg (node-postgres)
      // For this demo, we'll simulate a successful connection
      console.log('Connecting to database:', this.connectionConfig.database);
      this.isConnected = true;
      console.log('Database connection established');
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Close the database connection
  async disconnect() {
    if (this.isConnected) {
      // In a real implementation, this would close the actual connection
      console.log('Disconnecting from database');
      this.isConnected = false;
      return true;
    }
    return false;
  }

  // Execute a query
  async query(sql, params = []) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      // In a real implementation, this would execute the actual query
      console.log('Executing query:', sql);
      console.log('With parameters:', params);
      
      // For demo purposes, return mock data based on the query
      if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('notifications')) {
        return this.getMockNotifications();
      } else if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('calendar_events')) {
        return this.getMockCalendarEvents();
      } else if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('iterative_tasks')) {
        return this.getMockIterativeTasks();
      } else if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('ml_suggestions')) {
        return this.getMockMLSuggestions();
      }
      
      return { rows: [], rowCount: 0 };
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }

  // Get mock notifications data
  getMockNotifications() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const notifications = [
      {
        notification_id: 'notif1',
        user_id: 'user1',
        title: 'Quarterly Review Meeting',
        body: 'John Doe has requested a meeting for the Q2 performance review. Please approve or suggest an alternative time.',
        category_id: 'meeting',
        category_name: 'Meeting',
        priority: 'high',
        status: 'unread',
        created_at: now,
        is_starred: true,
        tags: ['meeting', 'review'],
        actions: [
          { action_id: 'action1', type: 'approve', label: 'Approve' },
          { action_id: 'action2', type: 'decline', label: 'Decline' },
          { action_id: 'action3', type: 'schedule', label: 'Suggest Time' }
        ]
      },
      {
        notification_id: 'notif2',
        user_id: 'user1',
        title: 'System Update Available',
        body: 'A new system update is available with important security patches. Please update your system as soon as possible to ensure continued protection.',
        category_id: 'system',
        category_name: 'System',
        priority: 'medium',
        status: 'unread',
        created_at: now,
        is_starred: false,
        tags: ['update', 'security'],
        actions: [
          { action_id: 'action4', type: 'button', label: 'Update Now' },
          { action_id: 'action5', type: 'button', label: 'Remind Later' }
        ]
      },
      {
        notification_id: 'notif3',
        user_id: 'user1',
        title: 'Task Completed: Project Alpha',
        body: 'The task "Implement user authentication" has been marked as completed by Jane Smith.',
        category_id: 'task',
        category_name: 'Task',
        priority: 'low',
        status: 'read',
        created_at: yesterday,
        read_at: yesterday,
        is_starred: false,
        tags: ['task', 'project'],
        actions: []
      },
      {
        notification_id: 'notif4',
        user_id: 'user1',
        title: 'Payment Processed',
        body: 'Your payment of $199.99 for Premium Subscription has been successfully processed.',
        category_id: 'system',
        category_name: 'System',
        priority: 'low',
        status: 'archived',
        created_at: yesterday,
        read_at: yesterday,
        archived_at: yesterday,
        is_starred: false,
        tags: ['payment', 'subscription'],
        actions: []
      }
    ];
    
    return { rows: notifications, rowCount: notifications.length };
  }

  // Get mock calendar events
  getMockCalendarEvents() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const events = [
      {
        event_id: 'event1',
        user_id: 'user1',
        title: 'Quarterly Review Meeting',
        description: 'Q2 performance review discussion',
        start_time: new Date(tomorrow.setHours(10, 0, 0, 0)),
        end_time: new Date(tomorrow.setHours(11, 30, 0, 0)),
        location: 'Conference Room A',
        notification_id: 'notif1',
        attendees: [
          { email: 'john@example.com', name: 'John Doe', is_organizer: true },
          { email: 'user@example.com', name: 'Sample User', is_organizer: false }
        ]
      },
      {
        event_id: 'event2',
        user_id: 'user1',
        title: 'Project Kickoff',
        description: 'Kickoff meeting for the new project',
        start_time: new Date(tomorrow.setHours(14, 0, 0, 0)),
        end_time: new Date(tomorrow.setHours(15, 0, 0, 0)),
        location: 'Virtual Meeting',
        notification_id: 'notif5',
        attendees: [
          { email: 'team@example.com', name: 'Project Team', is_organizer: false }
        ]
      },
      {
        event_id: 'event3',
        user_id: 'user1',
        title: 'Weekly Standup',
        description: 'Regular team standup meeting',
        start_time: new Date(tomorrow.setDate(tomorrow.getDate() + 2)),
        start_time: new Date(tomorrow.setHours(9, 0, 0, 0)),
        end_time: new Date(tomorrow.setHours(9, 30, 0, 0)),
        location: 'Virtual Meeting',
        recurrence: 'weekly',
        notification_id: 'notif6',
        attendees: [
          { email: 'team@example.com', name: 'Project Team', is_organizer: false }
        ]
      }
    ];
    
    return { rows: events, rowCount: events.length };
  }

  // Get mock iterative tasks
  getMockIterativeTasks() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const tasks = [
      {
        task_id: 'task1',
        user_id: 'user1',
        title: 'Weekly Report Submission',
        description: 'Submit weekly progress report',
        due_day: 5, // Friday
        due_time: '17:00:00',
        last_completed: lastWeek,
        completion_rate: 0.9,
        category_id: 'task',
        category_name: 'Task'
      },
      {
        task_id: 'task2',
        user_id: 'user1',
        title: 'Daily Code Review',
        description: 'Review pending pull requests',
        due_day: null, // Every day
        due_time: '16:00:00',
        last_completed: yesterday,
        completion_rate: 0.75,
        category_id: 'task',
        category_name: 'Task'
      }
    ];
    
    return { rows: tasks, rowCount: tasks.length };
  }

  // Get mock ML suggestions
  getMockMLSuggestions() {
    const suggestions = [
      {
        suggestion_id: 'sugg1',
        user_id: 'user1',
        type: 'time_preference',
        message: 'You tend to respond to notifications in the evening. Schedule non-urgent notifications for this time?',
        data: { timeOfDay: 'evening' },
        is_applied: false,
        created_at: new Date()
      },
      {
        suggestion_id: 'sugg2',
        user_id: 'user1',
        type: 'category_focus',
        message: 'You engage most with meeting notifications. Focus on these 2 items?',
        data: { category: 'meeting', count: 2 },
        is_applied: false,
        created_at: new Date()
      },
      {
        suggestion_id: 'sugg3',
        user_id: 'user1',
        type: 'priority_focus',
        message: 'You respond well to high priority items. Focus on these 1 notifications?',
        data: { priority: 'high', count: 1 },
        is_applied: false,
        created_at: new Date()
      }
    ];
    
    return { rows: suggestions, rowCount: suggestions.length };
  }
}

// Export a singleton instance
const dbConnection = new DatabaseConnection();
export default dbConnection;
