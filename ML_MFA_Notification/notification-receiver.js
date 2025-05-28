/**
 * Notification Receiver Module
 * 
 * This module listens for incoming push notifications from backend services
 * through WebSocket connections or API polling. It captures message content,
 * priority level, timestamp, and forwards it to the notification handling system.
 */

class NotificationReceiver {
  constructor(options = {}) {
    // Configuration options with defaults
    this.options = {
      websocketUrl: options.websocketUrl || null,
      apiEndpoint: options.apiEndpoint || null,
      pollingInterval: options.pollingInterval || 30000, // 30 seconds default
      maxRetries: options.maxRetries || 5,
      retryDelay: options.retryDelay || 3000, // 3 seconds default
      debug: options.debug || false
    };
    
    // State variables
    this.websocket = null;
    this.pollingTimer = null;
    this.retryCount = 0;
    this.connected = false;
    this.lastMessageTimestamp = localStorage.getItem('lastMessageTimestamp') || Date.now();
    
    // Event handlers
    this.onNotificationReceived = options.onNotificationReceived || this.defaultNotificationHandler;
    this.onConnectionStatusChange = options.onConnectionStatusChange || this.defaultConnectionStatusHandler;
    
    // Initialize the receiver
    this.init();
  }
  
  /**
   * Initialize the notification receiver
   */
  init() {
    this.log('Initializing notification receiver...');
    
    // If WebSocket URL is provided, try to connect
    if (this.options.websocketUrl) {
      this.connectWebSocket();
    } 
    // If API endpoint is provided, start polling
    else if (this.options.apiEndpoint) {
      this.startPolling();
    } 
    // If neither is provided, log an error
    else {
      console.error('No WebSocket URL or API endpoint provided. Notification receiver cannot start.');
    }
    
    // Set up event listeners for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.log('Page is now visible, reconnecting if needed');
        this.reconnect();
      } else {
        this.log('Page is now hidden');
      }
    });
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.log('Network is online, reconnecting');
      this.reconnect();
    });
    
    window.addEventListener('offline', () => {
      this.log('Network is offline, pausing connections');
      this.disconnect();
    });
  }
  
  /**
   * Connect to WebSocket server
   */
  connectWebSocket() {
    if (!this.options.websocketUrl) return;
    
    try {
      this.log(`Connecting to WebSocket at ${this.options.websocketUrl}`);
      this.websocket = new WebSocket(this.options.websocketUrl);
      
      // Set up WebSocket event handlers
      this.websocket.onopen = (event) => {
        this.log('WebSocket connection established');
        this.connected = true;
        this.retryCount = 0;
        this.onConnectionStatusChange(true);
        
        // Send authentication if needed
        // this.websocket.send(JSON.stringify({ type: 'auth', token: 'user-auth-token' }));
      };
      
      this.websocket.onmessage = (event) => {
        this.log('WebSocket message received', event.data);
        try {
          const notification = JSON.parse(event.data);
          this.processNotification(notification);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
        this.onConnectionStatusChange(false);
      };
      
      this.websocket.onclose = (event) => {
        this.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        this.connected = false;
        this.onConnectionStatusChange(false);
        
        // Try to reconnect if the connection was closed unexpectedly
        if (event.code !== 1000) { // 1000 is normal closure
          this.retryConnection();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.retryConnection();
    }
  }
  
  /**
   * Start polling the API endpoint for new notifications
   */
  startPolling() {
    if (!this.options.apiEndpoint) return;
    
    this.log(`Starting API polling at ${this.options.apiEndpoint}`);
    
    // Clear any existing polling timer
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
    
    // Perform initial poll
    this.pollForNotifications();
    
    // Set up regular polling
    this.pollingTimer = setInterval(() => {
      this.pollForNotifications();
    }, this.options.pollingInterval);
    
    this.connected = true;
    this.onConnectionStatusChange(true);
  }
  
  /**
   * Poll the API endpoint for new notifications
   */
  async pollForNotifications() {
    if (!this.options.apiEndpoint) return;
    
    try {
      this.log('Polling for new notifications');
      
      // Add the last message timestamp to get only new messages
      const url = new URL(this.options.apiEndpoint);
      url.searchParams.append('since', this.lastMessageTimestamp);
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const notifications = await response.json();
      
      if (Array.isArray(notifications) && notifications.length > 0) {
        this.log(`Received ${notifications.length} new notifications`);
        
        // Process each notification
        notifications.forEach(notification => {
          this.processNotification(notification);
        });
        
        // Update the last message timestamp to the latest notification
        const latestNotification = notifications.reduce((latest, current) => {
          return latest.timestamp > current.timestamp ? latest : current;
        });
        
        this.lastMessageTimestamp = latestNotification.timestamp;
        localStorage.setItem('lastMessageTimestamp', this.lastMessageTimestamp);
      } else {
        this.log('No new notifications');
      }
      
      this.retryCount = 0;
      this.connected = true;
      this.onConnectionStatusChange(true);
    } catch (error) {
      console.error('Error polling for notifications:', error);
      this.connected = false;
      this.onConnectionStatusChange(false);
      this.retryConnection();
    }
  }
  
  /**
   * Process a received notification
   * @param {Object} notification - The notification object
   */
  processNotification(notification) {
    // Validate the notification object
    if (!notification || !notification.content) {
      console.error('Invalid notification received:', notification);
      return;
    }
    
    // Ensure the notification has all required fields
    const processedNotification = {
      id: notification.id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: notification.content,
      title: notification.title || 'New Notification',
      priority: notification.priority || 'normal',
      timestamp: notification.timestamp || Date.now(),
      type: notification.type || 'info',
      read: false,
      source: notification.source || 'system'
    };
    
    // Forward the notification to the handler
    this.onNotificationReceived(processedNotification);
    
    // Update the UI to show the new notification
    this.updateNotificationUI(processedNotification);
  }
  
  /**
   * Update the UI to show the new notification
   * @param {Object} notification - The processed notification object
   */
  updateNotificationUI(notification) {
    // Create notification element
    this.displayNotification(notification);
    
    // Update notification counter
    this.updateNotificationCounter();
    
    // Play sound if enabled
    this.playNotificationSound(notification.priority);
  }
  
  /**
   * Display a notification in the UI
   * @param {Object} notification - The notification to display
   */
  displayNotification(notification) {
    // Check if we have the notification container
    let notificationContainer = document.getElementById('notification-container');
    
    // If not, create it
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'notification-container';
      notificationContainer.className = 'notification-container';
      document.body.appendChild(notificationContainer);
      
      // Add styles if not already present
      if (!document.getElementById('notification-receiver-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-receiver-styles';
        styles.textContent = `
          .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 350px;
            z-index: 9999;
          }
          
          .notification-item {
            background-color: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-bottom: 10px;
            padding: 15px;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateX(50px);
            border-left: 4px solid #000;
            position: relative;
          }
          
          .notification-item.show {
            opacity: 1;
            transform: translateX(0);
          }
          
          .notification-item.priority-high {
            border-left-color: #f44336;
          }
          
          .notification-item.priority-normal {
            border-left-color: #2196f3;
          }
          
          .notification-item.priority-low {
            border-left-color: #4caf50;
          }
          
          .notification-close {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
            font-size: 16px;
            color: #999;
          }
          
          .notification-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .notification-content {
            margin-bottom: 5px;
          }
          
          .notification-meta {
            font-size: 12px;
            color: #666;
            display: flex;
            justify-content: space-between;
          }
          
          .notification-counter {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #f44336;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
          }
        `;
        document.head.appendChild(styles);
      }
    }
    
    // Create notification item
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item priority-${notification.priority}`;
    notificationItem.dataset.id = notification.id;
    
    // Format the timestamp
    const formattedTime = new Date(notification.timestamp).toLocaleTimeString();
    
    // Set the HTML content
    notificationItem.innerHTML = `
      <div class="notification-close">&times;</div>
      <div class="notification-title">${notification.title}</div>
      <div class="notification-content">${notification.content}</div>
      <div class="notification-meta">
        <span class="notification-type">${notification.type}</span>
        <span class="notification-time">${formattedTime}</span>
      </div>
    `;
    
    // Add close button functionality
    notificationItem.querySelector('.notification-close').addEventListener('click', () => {
      notificationItem.style.opacity = '0';
      notificationItem.style.transform = 'translateX(50px)';
      setTimeout(() => {
        notificationItem.remove();
        this.updateNotificationCounter();
      }, 300);
    });
    
    // Add to container
    notificationContainer.appendChild(notificationItem);
    
    // Trigger animation
    setTimeout(() => {
      notificationItem.classList.add('show');
    }, 10);
    
    // Auto-remove after a delay based on priority
    const removeDelay = notification.priority === 'high' ? 10000 : 
                        notification.priority === 'normal' ? 7000 : 5000;
    
    setTimeout(() => {
      if (notificationItem.parentNode) {
        notificationItem.style.opacity = '0';
        notificationItem.style.transform = 'translateX(50px)';
        setTimeout(() => {
          if (notificationItem.parentNode) {
            notificationItem.remove();
            this.updateNotificationCounter();
          }
        }, 300);
      }
    }, removeDelay);
    
    // Store the notification in local storage for persistence
    this.storeNotification(notification);
  }
  
  /**
   * Update the notification counter in the UI
   */
  updateNotificationCounter() {
    // Get all unread notifications
    const unreadCount = this.getUnreadNotificationsCount();
    
    // Update or create the counter element
    let counterElement = document.getElementById('notification-counter');
    
    if (unreadCount > 0) {
      if (!counterElement) {
        counterElement = document.createElement('div');
        counterElement.id = 'notification-counter';
        counterElement.className = 'notification-counter';
        document.body.appendChild(counterElement);
      }
      counterElement.textContent = unreadCount > 99 ? '99+' : unreadCount;
      counterElement.style.display = 'flex';
    } else if (counterElement) {
      counterElement.style.display = 'none';
    }
  }
  
  /**
   * Get the count of unread notifications
   * @returns {number} The number of unread notifications
   */
  getUnreadNotificationsCount() {
    try {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error getting unread notifications count:', error);
      return 0;
    }
  }
  
  /**
   * Store a notification in local storage
   * @param {Object} notification - The notification to store
   */
  storeNotification(notification) {
    try {
      // Get existing notifications
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      
      // Add the new notification
      notifications.push(notification);
      
      // Limit to the last 100 notifications to prevent storage issues
      const limitedNotifications = notifications.slice(-100);
      
      // Save back to local storage
      localStorage.setItem('notifications', JSON.stringify(limitedNotifications));
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }
  
  /**
   * Play a notification sound based on priority
   * @param {string} priority - The notification priority
   */
  playNotificationSound(priority) {
    // Check if we should play sounds (could be a user preference)
    const soundEnabled = localStorage.getItem('notificationSoundEnabled') !== 'false';
    
    if (!soundEnabled) return;
    
    // Different sounds for different priorities
    let soundFile;
    
    switch (priority) {
      case 'high':
        soundFile = 'notification-high.mp3';
        break;
      case 'normal':
        soundFile = 'notification-normal.mp3';
        break;
      case 'low':
        soundFile = 'notification-low.mp3';
        break;
      default:
        soundFile = 'notification-normal.mp3';
    }
    
    // Try to play the sound
    try {
      const audio = new Audio(`sounds/${soundFile}`);
      audio.volume = 0.5; // 50% volume
      audio.play().catch(error => {
        // Autoplay might be blocked, that's okay
        this.log('Could not play notification sound:', error);
      });
    } catch (error) {
      this.log('Error playing notification sound:', error);
    }
  }
  
  /**
   * Retry connection after a failure
   */
  retryConnection() {
    if (this.retryCount >= this.options.maxRetries) {
      this.log('Maximum retry attempts reached. Giving up.');
      return;
    }
    
    this.retryCount++;
    const delay = this.options.retryDelay * this.retryCount;
    
    this.log(`Retrying connection in ${delay}ms (attempt ${this.retryCount}/${this.options.maxRetries})`);
    
    setTimeout(() => {
      if (this.options.websocketUrl) {
        this.connectWebSocket();
      } else if (this.options.apiEndpoint) {
        this.pollForNotifications();
      }
    }, delay);
  }
  
  /**
   * Reconnect to the notification source
   */
  reconnect() {
    if (this.connected) return;
    
    this.log('Attempting to reconnect...');
    
    if (this.websocket) {
      // Close the existing WebSocket if it's still open
      if (this.websocket.readyState === WebSocket.OPEN || 
          this.websocket.readyState === WebSocket.CONNECTING) {
        this.websocket.close();
      }
      this.connectWebSocket();
    } else if (this.options.apiEndpoint) {
      this.startPolling();
    }
  }
  
  /**
   * Disconnect from the notification source
   */
  disconnect() {
    this.log('Disconnecting from notification source');
    
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    
    this.connected = false;
    this.onConnectionStatusChange(false);
  }
  
  /**
   * Default notification handler
   * @param {Object} notification - The notification object
   */
  defaultNotificationHandler(notification) {
    console.log('Notification received:', notification);
    // This is a placeholder. The actual implementation should be provided by the user.
  }
  
  /**
   * Default connection status handler
   * @param {boolean} connected - Whether the connection is established
   */
  defaultConnectionStatusHandler(connected) {
    console.log('Connection status changed:', connected ? 'Connected' : 'Disconnected');
    // This is a placeholder. The actual implementation should be provided by the user.
  }
  
  /**
   * Log a message if debug mode is enabled
   * @param {...any} args - The arguments to log
   */
  log(...args) {
    if (this.options.debug) {
      console.log('[NotificationReceiver]', ...args);
    }
  }
}

// Export the NotificationReceiver class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationReceiver;
} else {
  window.NotificationReceiver = NotificationReceiver;
}
