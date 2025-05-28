// Calendar Integration for Notification Center
class CalendarIntegration {
  constructor() {
    this.meetings = [];
    this.reminderTasks = [];
    this.iterativeTasks = [];
    this.learningModel = new LearningModel();
  }

  // Initialize calendar with sample data
  init() {
    // Sample meetings data
    this.meetings = [
      {
        id: 'meet-1',
        title: 'Quarterly Review',
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 30, 0, 0)),
        attendees: ['john@example.com', 'sarah@example.com'],
        location: 'Conference Room A',
        priority: 'high',
        category: 'review',
        notificationId: 'notif-123'
      },
      {
        id: 'meet-2',
        title: 'Project Kickoff',
        start: new Date(new Date().setDate(new Date().getDate() + 1)),
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0)),
        attendees: ['team@example.com'],
        location: 'Virtual Meeting',
        priority: 'medium',
        category: 'project',
        notificationId: 'notif-124'
      },
      {
        id: 'meet-3',
        title: 'Weekly Standup',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(9, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(9, 30, 0, 0)),
        attendees: ['team@example.com'],
        location: 'Virtual Meeting',
        priority: 'medium',
        category: 'recurring',
        recurrence: 'weekly',
        notificationId: 'notif-125'
      }
    ];

    // Sample iterative tasks
    this.iterativeTasks = [
      {
        id: 'task-1',
        title: 'Weekly Report Submission',
        description: 'Submit weekly progress report',
        dueDay: 5, // Friday
        dueTime: '17:00',
        lastCompleted: new Date(new Date().setDate(new Date().getDate() - 7)),
        completionRate: 0.9, // 90% completion rate
        category: 'reporting',
        notificationId: 'notif-126'
      },
      {
        id: 'task-2',
        title: 'Daily Code Review',
        description: 'Review pending pull requests',
        dueDay: null, // Every day
        dueTime: '16:00',
        lastCompleted: new Date(new Date().setDate(new Date().getDate() - 1)),
        completionRate: 0.75,
        category: 'development',
        notificationId: 'notif-127'
      }
    ];

    return {
      meetings: this.meetings,
      iterativeTasks: this.iterativeTasks
    };
  }

  // Get meetings for a specific date
  getMeetingsForDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.meetings.filter(meeting => 
      meeting.start >= startOfDay && meeting.start <= endOfDay
    );
  }

  // Get meetings for a date range
  getMeetingsForDateRange(startDate, endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return this.meetings.filter(meeting => 
      meeting.start >= start && meeting.start <= end
    );
  }

  // Get upcoming meetings
  getUpcomingMeetings(limit = 5) {
    const now = new Date();
    return this.meetings
      .filter(meeting => meeting.start > now)
      .sort((a, b) => a.start - b.start)
      .slice(0, limit);
  }

  // Get iterative tasks due today
  getIterativeTasksDueToday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    return this.iterativeTasks.filter(task => 
      task.dueDay === null || task.dueDay === dayOfWeek
    );
  }

  // Schedule a new meeting from a notification
  scheduleMeeting(notification, startTime, endTime) {
    const newMeeting = {
      id: `meet-${this.meetings.length + 1}`,
      title: notification.title,
      start: startTime,
      end: endTime,
      attendees: notification.metadata?.attendees || [],
      location: notification.metadata?.location || 'Not specified',
      priority: notification.priority,
      category: notification.category,
      notificationId: notification.id
    };
    
    this.meetings.push(newMeeting);
    return newMeeting;
  }

  // Mark an iterative task as completed
  completeIterativeTask(taskId) {
    const task = this.iterativeTasks.find(t => t.id === taskId);
    if (task) {
      task.lastCompleted = new Date();
      // Update completion rate
      const completionHistory = task.completionHistory || [];
      completionHistory.push(new Date());
      if (completionHistory.length > 10) {
        completionHistory.shift(); // Keep only last 10 completions
      }
      task.completionHistory = completionHistory;
      
      // Calculate new completion rate
      const expectedCompletions = 10; // Last 10 expected completions
      task.completionRate = completionHistory.length / expectedCompletions;
      
      return task;
    }
    return null;
  }

  // Generate calendar view HTML
  generateCalendarHTML(month = new Date().getMonth(), year = new Date().getFullYear()) {
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    let calendarHTML = `
      <div class="calendar-header flex justify-between items-center mb-4">
        <button class="prev-month text-indigo-600 hover:text-indigo-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <h3 class="text-lg font-medium">${monthNames[month]} ${year}</h3>
        <button class="next-month text-indigo-600 hover:text-indigo-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="calendar-grid grid grid-cols-7 gap-1">
        <div class="calendar-day-header text-center text-xs font-medium text-gray-500">Sun</div>
        <div class="calendar-day-header text-center text-xs font-medium text-gray-500">Mon</div>
        <div class="calendar-day-header text-center text-xs font-medium text-gray-500">Tue</div>
        <div class="calendar-day-header text-center text-xs font-medium text-gray-500">Wed</div>
        <div class="calendar-day-header text-center text-xs font-medium text-gray-500">Thu</div>
        <div class="calendar-day-header text-center text-xs font-medium text-gray-500">Fri</div>
        <div class="calendar-day-header text-center text-xs font-medium text-gray-500">Sat</div>
    `;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      calendarHTML += `<div class="calendar-day empty"></div>`;
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const meetings = this.getMeetingsForDate(date);
      const hasMeetings = meetings.length > 0;
      
      calendarHTML += `
        <div class="calendar-day relative ${isToday ? 'bg-indigo-50 border border-indigo-200' : ''} ${hasMeetings ? 'has-meetings' : ''} p-1 min-h-[60px] rounded-md hover:bg-gray-50 cursor-pointer" data-date="${date.toISOString()}">
          <div class="day-number text-sm ${isToday ? 'font-bold text-indigo-700' : 'text-gray-700'}">${day}</div>
          ${hasMeetings ? `
            <div class="meeting-indicator mt-1">
              <div class="h-1.5 w-1.5 rounded-full bg-indigo-500 inline-block mr-1"></div>
              <span class="text-xs text-indigo-600">${meetings.length}</span>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Add empty cells for days after the last day of the month
    const totalCells = 42; // 6 rows of 7 days
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let i = 0; i < remainingCells; i++) {
      calendarHTML += `<div class="calendar-day empty"></div>`;
    }
    
    calendarHTML += `</div>`;
    
    return calendarHTML;
  }

  // Generate meetings list HTML for a specific date
  generateMeetingsListHTML(date) {
    const meetings = this.getMeetingsForDate(date);
    
    if (meetings.length === 0) {
      return `<p class="text-gray-500 text-sm">No meetings scheduled for this date.</p>`;
    }
    
    let meetingsHTML = `<div class="meetings-list space-y-2">`;
    
    meetings.forEach(meeting => {
      const startTime = meeting.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = meeting.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      meetingsHTML += `
        <div class="meeting-item p-2 rounded-md bg-white shadow-sm border-l-4 border-indigo-500" data-meeting-id="${meeting.id}">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium text-sm">${meeting.title}</h4>
              <p class="text-xs text-gray-600">${startTime} - ${endTime}</p>
              <p class="text-xs text-gray-600">${meeting.location}</p>
            </div>
            <div class="badge-${meeting.priority} text-xs px-2 py-0.5 rounded-full">
              ${meeting.priority}
            </div>
          </div>
        </div>
      `;
    });
    
    meetingsHTML += `</div>`;
    
    return meetingsHTML;
  }
}

// Learning Model for Notification Center
class LearningModel {
  constructor() {
    this.userPreferences = {
      preferredNotificationTime: {
        morning: 0,
        afternoon: 0,
        evening: 0
      },
      categoryInteractions: {},
      priorityResponses: {
        low: { viewed: 0, actioned: 0 },
        medium: { viewed: 0, actioned: 0 },
        high: { viewed: 0, actioned: 0 },
        urgent: { viewed: 0, actioned: 0 }
      },
      responseTimeByPriority: {
        low: [],
        medium: [],
        high: [],
        urgent: []
      }
    };
    
    this.loadFromStorage();
    this.initializeWithSampleData();
  }
  
  // Initialize with sample data for demonstration
  initializeWithSampleData() {
    if (this.isNewUser()) {
      this.userPreferences.preferredNotificationTime = {
        morning: 15,
        afternoon: 35,
        evening: 50
      };
      
      this.userPreferences.categoryInteractions = {
        meeting: { viewed: 42, actioned: 38 },
        system: { viewed: 30, actioned: 25 },
        social: { viewed: 28, actioned: 15 },
        task: { viewed: 35, actioned: 30 }
      };
      
      this.userPreferences.priorityResponses = {
        low: { viewed: 25, actioned: 15 },
        medium: { viewed: 40, actioned: 30 },
        high: { viewed: 35, actioned: 32 },
        urgent: { viewed: 20, actioned: 19 }
      };
      
      // Save to storage
      this.saveToStorage();
    }
  }
  
  isNewUser() {
    // Check if this appears to be a new user based on interaction data
    const totalInteractions = 
      this.userPreferences.priorityResponses.low.viewed +
      this.userPreferences.priorityResponses.medium.viewed +
      this.userPreferences.priorityResponses.high.viewed +
      this.userPreferences.priorityResponses.urgent.viewed;
      
    return totalInteractions < 10; // Arbitrary threshold
  }
  
  // Load user preferences from localStorage
  loadFromStorage() {
    const savedPreferences = localStorage.getItem('notificationLearningModel');
    if (savedPreferences) {
      try {
        this.userPreferences = JSON.parse(savedPreferences);
      } catch (e) {
        console.error('Failed to load learning model data:', e);
      }
    }
  }
  
  // Save user preferences to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('notificationLearningModel', JSON.stringify(this.userPreferences));
    } catch (e) {
      console.error('Failed to save learning model data:', e);
    }
  }
  
  // Record a notification view
  recordView(notification) {
    const { category, priority } = notification;
    
    // Initialize category if it doesn't exist
    if (!this.userPreferences.categoryInteractions[category]) {
      this.userPreferences.categoryInteractions[category] = { viewed: 0, actioned: 0 };
    }
    
    // Increment view count
    this.userPreferences.categoryInteractions[category].viewed++;
    this.userPreferences.priorityResponses[priority].viewed++;
    
    // Record time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.userPreferences.preferredNotificationTime.morning++;
    } else if (hour >= 12 && hour < 18) {
      this.userPreferences.preferredNotificationTime.afternoon++;
    } else {
      this.userPreferences.preferredNotificationTime.evening++;
    }
    
    this.saveToStorage();
  }
  
  // Record a notification action
  recordAction(notification, actionType) {
    const { category, priority } = notification;
    
    // Initialize category if it doesn't exist
    if (!this.userPreferences.categoryInteractions[category]) {
      this.userPreferences.categoryInteractions[category] = { viewed: 1, actioned: 0 };
    }
    
    // Increment action count
    this.userPreferences.categoryInteractions[category].actioned++;
    this.userPreferences.priorityResponses[priority].actioned++;
    
    // Record response time if we have a view timestamp
    if (notification.viewedAt) {
      const responseTime = new Date() - new Date(notification.viewedAt);
      this.userPreferences.responseTimeByPriority[priority].push(responseTime);
      
      // Keep only the last 20 response times
      if (this.userPreferences.responseTimeByPriority[priority].length > 20) {
        this.userPreferences.responseTimeByPriority[priority].shift();
      }
    }
    
    this.saveToStorage();
  }
  
  // Get preferred notification time
  getPreferredNotificationTime() {
    const { morning, afternoon, evening } = this.userPreferences.preferredNotificationTime;
    const total = morning + afternoon + evening;
    
    if (total === 0) return 'anytime';
    
    const morningPct = (morning / total) * 100;
    const afternoonPct = (afternoon / total) * 100;
    const eveningPct = (evening / total) * 100;
    
    if (morningPct > 50) return 'morning';
    if (afternoonPct > 50) return 'afternoon';
    if (eveningPct > 50) return 'evening';
    
    // If no clear preference, return the highest
    if (morning >= afternoon && morning >= evening) return 'morning';
    if (afternoon >= morning && afternoon >= evening) return 'afternoon';
    return 'evening';
  }
  
  // Get preferred categories (sorted by engagement rate)
  getPreferredCategories() {
    const categories = Object.entries(this.userPreferences.categoryInteractions)
      .map(([category, data]) => {
        const engagementRate = data.viewed > 0 ? data.actioned / data.viewed : 0;
        return { category, engagementRate, interactions: data.viewed };
      })
      .filter(item => item.interactions >= 5) // Require at least 5 interactions
      .sort((a, b) => b.engagementRate - a.engagementRate);
    
    return categories;
  }
  
  // Get priority response rates
  getPriorityResponseRates() {
    return Object.entries(this.userPreferences.priorityResponses)
      .map(([priority, data]) => {
        const responseRate = data.viewed > 0 ? data.actioned / data.viewed : 0;
        return { priority, responseRate, viewed: data.viewed };
      })
      .sort((a, b) => b.responseRate - a.responseRate);
  }
  
  // Generate personalized suggestions based on user behavior
  generateSuggestions(notifications) {
    const suggestions = [];
    
    // Suggest focusing on high-engagement categories
    const preferredCategories = this.getPreferredCategories();
    if (preferredCategories.length > 0) {
      const topCategory = preferredCategories[0].category;
      const categoryNotifications = notifications.filter(n => n.category === topCategory);
      
      if (categoryNotifications.length > 0) {
        suggestions.push({
          type: 'category_focus',
          message: `You engage most with ${topCategory} notifications. Focus on these ${categoryNotifications.length} items?`,
          data: { category: topCategory, count: categoryNotifications.length }
        });
      }
    }
    
    // Suggest optimal notification time
    const preferredTime = this.getPreferredNotificationTime();
    if (preferredTime !== 'anytime') {
      suggestions.push({
        type: 'time_preference',
        message: `You tend to respond to notifications in the ${preferredTime}. Schedule non-urgent notifications for this time?`,
        data: { timeOfDay: preferredTime }
      });
    }
    
    // Suggest prioritization based on response patterns
    const priorityRates = this.getPriorityResponseRates();
    if (priorityRates.length > 0 && priorityRates[0].viewed >= 10) {
      const topPriority = priorityRates[0].priority;
      const priorityNotifications = notifications.filter(n => n.priority === topPriority && !n.isRead);
      
      if (priorityNotifications.length > 0) {
        suggestions.push({
          type: 'priority_focus',
          message: `You respond well to ${topPriority} priority items. Focus on these ${priorityNotifications.length} notifications?`,
          data: { priority: topPriority, count: priorityNotifications.length }
        });
      }
    }
    
    return suggestions;
  }
}

// Initialize the calendar integration
const calendarSystem = new CalendarIntegration();
