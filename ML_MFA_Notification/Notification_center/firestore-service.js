// Firestore Service for Notification Center
// This service handles all interactions with the Firestore database

class FirestoreService {
  constructor() {
    this.db = null;
    this.auth = null;
    this.currentUser = null;
  }

  // Initialize the service with Firebase instances
  initialize(db, auth) {
    this.db = db;
    this.auth = auth;
    
    // Listen for auth state changes
    this.auth.onAuthStateChanged(user => {
      this.currentUser = user;
      if (user) {
        console.log('User signed in:', user.displayName);
        // Dispatch an event that user is signed in
        document.dispatchEvent(new CustomEvent('user-signed-in', { detail: user }));
      } else {
        console.log('User signed out');
        // Dispatch an event that user is signed out
        document.dispatchEvent(new CustomEvent('user-signed-out'));
      }
    });
  }

  // Get the current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Sign in with Google
  async signInWithGoogle(googleAuthProvider) {
    try {
      const result = await this.auth.signInWithPopup(googleAuthProvider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get all notifications for the current user
  async getNotifications() {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const snapshot = await this.db.collection('notifications')
        .where('userId', '==', this.currentUser.uid)
        .where('status', '!=', 'deleted')
        .orderBy('status')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        readAt: doc.data().readAt?.toDate(),
        archivedAt: doc.data().archivedAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate(),
        scheduledFor: doc.data().scheduledFor?.toDate(),
        reminderTime: doc.data().reminderTime?.toDate()
      }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  // Get notifications by status
  async getNotificationsByStatus(status) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const snapshot = await this.db.collection('notifications')
        .where('userId', '==', this.currentUser.uid)
        .where('status', '==', status)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        readAt: doc.data().readAt?.toDate(),
        archivedAt: doc.data().archivedAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate(),
        scheduledFor: doc.data().scheduledFor?.toDate(),
        reminderTime: doc.data().reminderTime?.toDate()
      }));
    } catch (error) {
      console.error(`Error getting ${status} notifications:`, error);
      throw error;
    }
  }

  // Get notifications by date range
  async getNotificationsByDateRange(startDate, endDate) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const snapshot = await this.db.collection('notifications')
        .where('userId', '==', this.currentUser.uid)
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        readAt: doc.data().readAt?.toDate(),
        archivedAt: doc.data().archivedAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate(),
        scheduledFor: doc.data().scheduledFor?.toDate(),
        reminderTime: doc.data().reminderTime?.toDate()
      }));
    } catch (error) {
      console.error('Error getting notifications by date range:', error);
      throw error;
    }
  }

  // Get a single notification by ID
  async getNotification(notificationId) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const doc = await this.db.collection('notifications').doc(notificationId).get();
      
      if (!doc.exists) {
        throw new Error('Notification not found');
      }
      
      const data = doc.data();
      if (data.userId !== this.currentUser.uid) {
        throw new Error('Unauthorized access to notification');
      }
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        readAt: data.readAt?.toDate(),
        archivedAt: data.archivedAt?.toDate(),
        expiresAt: data.expiresAt?.toDate(),
        scheduledFor: data.scheduledFor?.toDate(),
        reminderTime: data.reminderTime?.toDate()
      };
    } catch (error) {
      console.error('Error getting notification:', error);
      throw error;
    }
  }

  // Create a new notification
  async createNotification(notificationData) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const now = new Date();
      
      const notification = {
        userId: this.currentUser.uid,
        title: notificationData.title,
        body: notificationData.body,
        category: notificationData.category || 'general',
        priority: notificationData.priority || 'medium',
        status: 'unread',
        createdAt: firebase.firestore.Timestamp.fromDate(now),
        updatedAt: firebase.firestore.Timestamp.fromDate(now),
        isStarred: false,
        isDraft: notificationData.isDraft || false,
        isAwaiting: notificationData.isAwaiting || false,
        tags: notificationData.tags || [],
        actions: notificationData.actions || [],
        metadata: notificationData.metadata || {}
      };
      
      // Add optional fields if they exist
      if (notificationData.expiresAt) {
        notification.expiresAt = firebase.firestore.Timestamp.fromDate(new Date(notificationData.expiresAt));
      }
      
      if (notificationData.scheduledFor) {
        notification.scheduledFor = firebase.firestore.Timestamp.fromDate(new Date(notificationData.scheduledFor));
      }
      
      if (notificationData.reminderTime) {
        notification.reminderTime = firebase.firestore.Timestamp.fromDate(new Date(notificationData.reminderTime));
      }
      
      const docRef = await this.db.collection('notifications').add(notification);
      
      // Record this creation in the user's activity
      await this.recordUserActivity('create_notification', { notificationId: docRef.id });
      
      return {
        id: docRef.id,
        ...notification,
        createdAt: notification.createdAt.toDate(),
        updatedAt: notification.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Update a notification
  async updateNotification(notificationId, updates) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      // First, get the notification to check ownership
      const doc = await this.db.collection('notifications').doc(notificationId).get();
      
      if (!doc.exists) {
        throw new Error('Notification not found');
      }
      
      const data = doc.data();
      if (data.userId !== this.currentUser.uid) {
        throw new Error('Unauthorized access to notification');
      }
      
      // Prepare the update object
      const updateData = {
        ...updates,
        updatedAt: firebase.firestore.Timestamp.fromDate(new Date())
      };
      
      // Convert any Date objects to Firestore Timestamps
      if (updates.readAt) {
        updateData.readAt = firebase.firestore.Timestamp.fromDate(new Date(updates.readAt));
      }
      
      if (updates.archivedAt) {
        updateData.archivedAt = firebase.firestore.Timestamp.fromDate(new Date(updates.archivedAt));
      }
      
      if (updates.expiresAt) {
        updateData.expiresAt = firebase.firestore.Timestamp.fromDate(new Date(updates.expiresAt));
      }
      
      if (updates.scheduledFor) {
        updateData.scheduledFor = firebase.firestore.Timestamp.fromDate(new Date(updates.scheduledFor));
      }
      
      if (updates.reminderTime) {
        updateData.reminderTime = firebase.firestore.Timestamp.fromDate(new Date(updates.reminderTime));
      }
      
      // Update the notification
      await this.db.collection('notifications').doc(notificationId).update(updateData);
      
      // Record this update in the user's activity
      await this.recordUserActivity('update_notification', { 
        notificationId, 
        updates: Object.keys(updates) 
      });
      
      // Get the updated notification
      const updatedDoc = await this.db.collection('notifications').doc(notificationId).get();
      const updatedData = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData.createdAt.toDate(),
        updatedAt: updatedData.updatedAt.toDate(),
        readAt: updatedData.readAt?.toDate(),
        archivedAt: updatedData.archivedAt?.toDate(),
        expiresAt: updatedData.expiresAt?.toDate(),
        scheduledFor: updatedData.scheduledFor?.toDate(),
        reminderTime: updatedData.reminderTime?.toDate()
      };
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId) {
    return this.updateNotification(notificationId, {
      status: 'read',
      readAt: new Date()
    });
  }

  // Mark a notification as unread
  async markAsUnread(notificationId) {
    return this.updateNotification(notificationId, {
      status: 'unread',
      readAt: null
    });
  }

  // Archive a notification
  async archiveNotification(notificationId) {
    return this.updateNotification(notificationId, {
      status: 'archived',
      archivedAt: new Date()
    });
  }

  // Unarchive a notification
  async unarchiveNotification(notificationId) {
    return this.updateNotification(notificationId, {
      status: 'read',
      archivedAt: null
    });
  }

  // Delete a notification
  async deleteNotification(notificationId) {
    return this.updateNotification(notificationId, {
      status: 'deleted',
      deletedAt: new Date()
    });
  }

  // Star a notification
  async starNotification(notificationId) {
    return this.updateNotification(notificationId, {
      isStarred: true
    });
  }

  // Unstar a notification
  async unstarNotification(notificationId) {
    return this.updateNotification(notificationId, {
      isStarred: false
    });
  }

  // Record user activity for ML model
  async recordUserActivity(activityType, details = {}) {
    if (!this.currentUser) {
      return;
    }

    try {
      const activity = {
        userId: this.currentUser.uid,
        activityType,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        details
      };
      
      await this.db.collection('user_activities').add(activity);
    } catch (error) {
      console.error('Error recording user activity:', error);
      // Don't throw here, as this is a background operation
    }
  }

  // Get calendar events
  async getCalendarEvents(startDate, endDate) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const snapshot = await this.db.collection('calendar_events')
        .where('userId', '==', this.currentUser.uid)
        .where('startTime', '>=', firebase.firestore.Timestamp.fromDate(startDate))
        .where('startTime', '<=', firebase.firestore.Timestamp.fromDate(endDate))
        .orderBy('startTime')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  // Create a calendar event
  async createCalendarEvent(eventData) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const now = new Date();
      
      const event = {
        userId: this.currentUser.uid,
        title: eventData.title,
        description: eventData.description || '',
        startTime: firebase.firestore.Timestamp.fromDate(new Date(eventData.startTime)),
        endTime: firebase.firestore.Timestamp.fromDate(new Date(eventData.endTime)),
        location: eventData.location || '',
        isAllDay: eventData.isAllDay || false,
        recurrence: eventData.recurrence || 'none',
        recurrenceRule: eventData.recurrenceRule || '',
        notificationId: eventData.notificationId || null,
        createdAt: firebase.firestore.Timestamp.fromDate(now),
        updatedAt: firebase.firestore.Timestamp.fromDate(now)
      };
      
      const docRef = await this.db.collection('calendar_events').add(event);
      
      // Add attendees if provided
      if (eventData.attendees && eventData.attendees.length > 0) {
        const attendeesPromises = eventData.attendees.map(attendee => 
          this.db.collection('calendar_event_attendees').add({
            eventId: docRef.id,
            email: attendee.email,
            name: attendee.name || '',
            responseStatus: attendee.responseStatus || 'pending',
            isOrganizer: attendee.isOrganizer || false
          })
        );
        
        await Promise.all(attendeesPromises);
      }
      
      // Record this creation in the user's activity
      await this.recordUserActivity('create_calendar_event', { eventId: docRef.id });
      
      return {
        id: docRef.id,
        ...event,
        startTime: event.startTime.toDate(),
        endTime: event.endTime.toDate(),
        createdAt: event.createdAt.toDate(),
        updatedAt: event.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  // Get ML suggestions for the user
  async getMLSuggestions() {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const snapshot = await this.db.collection('ml_suggestions')
        .where('userId', '==', this.currentUser.uid)
        .where('isApplied', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        appliedAt: doc.data().appliedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting ML suggestions:', error);
      throw error;
    }
  }

  // Apply an ML suggestion
  async applyMLSuggestion(suggestionId) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      await this.db.collection('ml_suggestions').doc(suggestionId).update({
        isApplied: true,
        appliedAt: firebase.firestore.Timestamp.fromDate(new Date())
      });
      
      // Record this action in the user's activity
      await this.recordUserActivity('apply_ml_suggestion', { suggestionId });
      
      return true;
    } catch (error) {
      console.error('Error applying ML suggestion:', error);
      throw error;
    }
  }

  // Get user preferences
  async getUserPreferences() {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const doc = await this.db.collection('user_preferences').doc(this.currentUser.uid).get();
      
      if (!doc.exists) {
        // Create default preferences if none exist
        const defaultPreferences = {
          userId: this.currentUser.uid,
          notificationDelivery: {
            email: true,
            push: true,
            inApp: true,
            sms: false
          },
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '07:00',
            days: [0, 1, 2, 3, 4, 5, 6]
          },
          digestPreferences: {
            enabled: false,
            frequency: 'daily',
            time: '08:00',
            days: [1, 3, 5]
          },
          theme: 'light',
          language: 'en'
        };
        
        await this.db.collection('user_preferences').doc(this.currentUser.uid).set(defaultPreferences);
        
        return defaultPreferences;
      }
      
      return doc.data();
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  }

  // Update user preferences
  async updateUserPreferences(preferences) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      await this.db.collection('user_preferences').doc(this.currentUser.uid).update({
        ...preferences,
        updatedAt: firebase.firestore.Timestamp.fromDate(new Date())
      });
      
      // Record this update in the user's activity
      await this.recordUserActivity('update_preferences', { 
        updates: Object.keys(preferences) 
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const firestoreService = new FirestoreService();
export default firestoreService;
